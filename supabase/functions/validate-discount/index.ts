import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  try {
    const { code } = await req.json()
    if (typeof code !== 'string' || code.length === 0 || code.length > 64) {
      return new Response(JSON.stringify({ error: 'Invalid code' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data, error } = await admin.rpc('validate_discount_code', {
      code_to_check: code.trim().toUpperCase(),
    })
    if (error) throw error
    const row = Array.isArray(data) && data.length > 0 ? data[0] : null
    return new Response(
      JSON.stringify({
        is_valid: !!row?.is_valid,
        discount_percentage: row?.discount_percentage ?? 0,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
