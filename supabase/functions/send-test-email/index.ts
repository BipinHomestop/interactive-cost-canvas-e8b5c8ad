
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@1.1.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    const emailResponse = await resend.emails.send({
      from: 'American Concrete Coatings <no-reply@homestop.us>',
      to: ['bipin@homestop.us'],
      subject: 'Test Email from American Concrete Coatings',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email sent from the American Concrete Coatings system.</p>
        <p>If you are receiving this, the email configuration is working correctly.</p>
        <br>
        <small>Sent: ${new Date().toLocaleString()}</small>
      `
    });

    console.log("Test email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, message: "Test email sent" }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      }
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders 
      }
    });
  }
});
