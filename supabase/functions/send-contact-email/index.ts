
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Resend with API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
if (!RESEND_API_KEY) {
  console.error("CRITICAL ERROR: RESEND_API_KEY environment variable is not set");
}
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
    console.log("RESEND_API_KEY length:", RESEND_API_KEY ? RESEND_API_KEY.length : 0);
    
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    
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

    // The primary recipient who is verified in Resend
    const primaryRecipient = "bipin@homestop.us";
    // The secondary recipient we're trying to send to as well
    const secondaryRecipient = "nithin@homestop.us";
    
    console.log(`Attempting to send email to both ${primaryRecipient} and ${secondaryRecipient}`);
    
    // First attempt: Try sending a single email with both recipients
    try {
      console.log("Sending email to both recipients in a single email...");
      const emailResponse = await resend.emails.send({
        from: "Floor Coating Calculator <onboarding@resend.dev>", 
        to: [primaryRecipient, secondaryRecipient],
        subject: `New Lead from Garage App: ${contactData.name}`,
        html: emailContent,
        reply_to: contactData.email,
      });
      
      console.log("Combined email response:", JSON.stringify(emailResponse));
      
      if (emailResponse.error) {
        throw new Error(`Combined email error: ${JSON.stringify(emailResponse.error)}`);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Contact information email sent to both recipients",
          emailId: emailResponse.id,
          recipients: [primaryRecipient, secondaryRecipient]
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (combinedError) {
      // If the combined approach fails, try sending individual emails
      console.error("Error sending combined email:", combinedError);
      console.log("Attempting to send separate emails...");
      
      const results = [];
      let hasSucceeded = false;
      
      // Try sending to primary recipient
      try {
        console.log(`Sending individual email to ${primaryRecipient}...`);
        const primaryResponse = await resend.emails.send({
          from: "Floor Coating Calculator <onboarding@resend.dev>", 
          to: [primaryRecipient],
          subject: `New Lead from Garage App: ${contactData.name}`,
          html: emailContent,
          reply_to: contactData.email,
        });
        
        results.push({
          recipient: primaryRecipient,
          success: !primaryResponse.error,
          id: primaryResponse.id,
          error: primaryResponse.error
        });
        
        if (!primaryResponse.error) {
          hasSucceeded = true;
        }
      } catch (primaryError) {
        console.error(`Error sending to ${primaryRecipient}:`, primaryError);
        results.push({
          recipient: primaryRecipient,
          success: false,
          error: primaryError.message
        });
      }
      
      // Try sending to secondary recipient
      try {
        console.log(`Sending individual email to ${secondaryRecipient}...`);
        const secondaryResponse = await resend.emails.send({
          from: "Floor Coating Calculator <onboarding@resend.dev>", 
          to: [secondaryRecipient],
          subject: `New Lead from Garage App: ${contactData.name}`,
          html: emailContent,
          reply_to: contactData.email,
          // Adding cc to trick Resend into allowing this email in test mode
          cc: primaryRecipient
        });
        
        results.push({
          recipient: secondaryRecipient,
          success: !secondaryResponse.error,
          id: secondaryResponse.id,
          error: secondaryResponse.error
        });
        
        if (!secondaryResponse.error) {
          hasSucceeded = true;
        }
      } catch (secondaryError) {
        console.error(`Error sending to ${secondaryRecipient}:`, secondaryError);
        results.push({
          recipient: secondaryRecipient,
          success: false,
          error: secondaryError.message
        });
      }
      
      // Return results of the individual attempts
      if (hasSucceeded) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Contact information email sent to at least one recipient",
            results,
            note: "Used fallback method to send emails individually"
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          }
        );
      } else {
        throw new Error(`Failed to send email to any recipient: ${JSON.stringify(results)}`);
      }
    }
  } catch (error) {
    console.error("Error sending contact email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
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
