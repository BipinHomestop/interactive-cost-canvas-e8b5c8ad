
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Resend with API key from environment variable
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const emailResponse = await resend.emails.send({
      from: "Floor Coating Calculator <onboarding@resend.dev>",
      to: ["nithin@homestop"],
      subject: "New Floor Coating Calculator Contact",
      html: emailContent,
      reply_to: contactData.email,
    });

    console.log("Email sending response:", emailResponse);

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
  } catch (error) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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
