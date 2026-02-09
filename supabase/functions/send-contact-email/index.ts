import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Rate limiting: Store IP addresses and timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface ContactData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

// Simple input sanitization function
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return char;
      }
    })
    .slice(0, 500); // Limit length to prevent abuse
}

// Rate limiting check
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // Remove old requests outside the window
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    rateLimitMap.clear();
  }
  
  return true;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    if (!checkRateLimit(clientIP)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const contactData: ContactData = await req.json();

    // Sanitize all inputs to prevent injection attacks
    const sanitizedName = sanitizeInput(contactData.name || '');
    const sanitizedEmail = sanitizeInput(contactData.email || '');
    const sanitizedPhone = sanitizeInput(contactData.phone || '');
    const sanitizedLocation = sanitizeInput(contactData.location || '');

    // Validate inputs
    if (!sanitizedName || !sanitizedEmail || !sanitizedPhone || !sanitizedLocation) {
      return new Response(
        JSON.stringify({ error: "Invalid input data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get email recipients from environment variable or use defaults
    const recipientsEnv = Deno.env.get("CONTACT_EMAIL_RECIPIENTS");
    const recipients = recipientsEnv 
      ? recipientsEnv.split(',').map(email => email.trim())
      : ["bipin@homestop.us", "nithin@homestop.us"];

    const emailHtml = `
      <h2>New Contact from Garage Floor Coating Calculator</h2>
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Phone:</strong> ${sanitizedPhone}</p>
      <p><strong>Location (ZIP):</strong> ${sanitizedLocation}</p>
      <p><em>This contact was submitted via the cost calculator on your website.</em></p>
    `;

    // Send email to all recipients
    const combinedEmailResponse = await resend.emails.send({
      from: "Garage Floor Coating <onboarding@resend.dev>",
      to: recipients,
      subject: `New Lead: ${sanitizedName} - ${sanitizedLocation}`,
      html: emailHtml,
    });

    if (combinedEmailResponse.error) {
      throw combinedEmailResponse.error;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Contact email sent successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    // Log error details server-side only, return generic message to client
    console.error("Error in send-contact-email function:", error);

    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);