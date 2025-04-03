
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Resend with API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(RESEND_API_KEY);

interface ContactData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log API key presence (not the actual key)
    console.log("RESEND_API_KEY available:", !!RESEND_API_KEY);
    
    const contactData: ContactData = await req.json();
    console.log("Contact data received:", contactData);

    // Simple validation
    if (!contactData.name || !contactData.email || !contactData.phone) {
      throw new Error("Missing required contact information");
    }

    // Format the email content
    const emailContent = `
      <h2>New Contact Information from Floor Coating Calculator</h2>
      <p><strong>Name:</strong> ${contactData.name}</p>
      <p><strong>Email:</strong> ${contactData.email}</p>
      <p><strong>Phone:</strong> ${contactData.phone}</p>
      <p><strong>Location (ZIP):</strong> ${contactData.location || "Not provided"}</p>
      <p><em>This information was submitted on ${new Date().toLocaleString()}</em></p>
    `;

    // Send the email using Resend
    console.log("Sending email to: nithin@homestop.us, bipin@homestop.us");
    
    try {
      const emailResponse = await resend.emails.send({
        from: "Floor Coating Calculator <onboarding@resend.dev>",
        to: ["nithin@homestop.us", "bipin@homestop.us"],
        subject: "Hey! New Lead from Garage App Calculator",
        html: emailContent,
        reply_to: contactData.email,
      });

      console.log("Email sending response:", emailResponse);
      
      if (emailResponse.error) {
        throw new Error(`Resend API error: ${JSON.stringify(emailResponse.error)}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact information email sent",
          emailId: emailResponse.id
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError) {
      console.error("Error from Resend API:", emailError);
      throw emailError;
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
