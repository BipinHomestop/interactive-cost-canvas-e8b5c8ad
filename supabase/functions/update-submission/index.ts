import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl!, serviceKey!);

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

function sanitizeZip(zip?: string): string | null {
  if (!zip) return null;
  const v = zip.replace(/\D/g, "").slice(0, 5);
  return /^[0-9]{5}$/.test(v) ? v : null;
}

function sanitizeName(name?: string): string | null {
  if (!name) return null;
  const v = name.trim();
  if (!v) return null;
  // Allow letters, spaces, apostrophes, hyphens, and periods
  return /^[a-zA-Z .'-]{2,100}$/.test(v) ? v : null;
}

function sanitizeEmail(email?: string): string | null {
  if (!email) return null;
  const v = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(v) && v.length <= 255 ? v : null;
}

function sanitizePhone(phone?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  // Accept 10-15 digit international numbers
  return digits.length >= 10 && digits.length <= 15 ? digits : null;
}

function sanitizeNumber(n: any): number | undefined {
  const num = typeof n === 'number' ? n : parseFloat(n);
  return Number.isFinite(num) ? num : undefined;
}

function sanitizeUpdate(input: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  const allowed = new Set([
    'name','email','phone','location',
    'garage_capacity','garage_finish','need_stem_walls','stem_wall_type',
    'need_steps','need_extra_footage','extra_footage','current_condition',
    'total_price','discount_code','discount_percentage',
    'preferred_installation_date','checkout_session_id','payment_status'
  ]);

  for (const [k, v] of Object.entries(input || {})) {
    if (!allowed.has(k)) continue;
    switch (k) {
      case 'name': {
        const s = sanitizeName(v);
        if (s !== null) out.name = s; break;
      }
      case 'email': {
        const s = sanitizeEmail(v);
        if (s !== null) out.email = s; break;
      }
      case 'phone': {
        const s = sanitizePhone(v);
        if (s !== null) out.phone = s; break;
      }
      case 'location': {
        const s = sanitizeZip(v);
        if (s !== null) out.location = s; break;
      }
      case 'garage_capacity': {
        const n = sanitizeNumber(v);
        if (n !== undefined) out.garage_capacity = Math.max(1, Math.floor(n));
        break;
      }
      case 'total_price': {
        const n = sanitizeNumber(v);
        if (n !== undefined && n > 0) out.total_price = n;
        break;
      }
      case 'discount_percentage': {
        const n = sanitizeNumber(v);
        if (n !== undefined && n >= 0 && n <= 100) out.discount_percentage = n;
        break;
      }
      default: {
        // Pass through safe primitives directly for other whitelisted fields
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' || v === null) {
          out[k] = v;
        }
      }
    }
  }
  return out;
}

interface Payload {
  id: string;
  update: Record<string, any>;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id, update }: Payload = await req.json();
    if (!id || !isUuid(id)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing id' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const updateData = sanitizeUpdate(update);
    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    console.log('update-submission: updating', id, 'with', updateData);

    const { error } = await supabase
      .from('cost_calculator_submissions')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('update-submission error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  } catch (err: any) {
    console.error('update-submission exception:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Unexpected error' }), { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
  }
});