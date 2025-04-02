
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
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

  const stripeKey = Deno.env.get("STRIPE_RESTRICTED_KEY") || Deno.env.get("STRIPE_SECRET_KEY");
  const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!stripeKey || !stripeWebhookSecret || !resendApiKey) {
    console.error("Missing required environment variables");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }

  try {
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
    });

    const resend = new Resend(resendApiKey);
    
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    console.log(`Event received: ${event.type}`);

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const submissionId = session.metadata?.submission_id;
      
      if (submissionId) {
        console.log(`Processing completed checkout for submission: ${submissionId}`);
        
        // Update submission status
        const { data: submission, error } = await supabaseClient
          .from('cost_calculator_submissions')
          .update({ 
            payment_status: 'completed',
            payment_intent_id: session.payment_intent || null
          })
          .eq('id', submissionId)
          .select('*')
          .single();
          
        if (error) {
          console.error("Error updating submission:", error);
        } else {
          console.log("Submission updated successfully:", submission);
          
          // Send email notification
          try {
            const formattedDate = submission.preferred_installation_date 
              ? new Date(submission.preferred_installation_date).toLocaleDateString('en-US', {
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })
              : 'Not specified';

            const emailContent = `
              <h1>New Payment Complete!</h1>
              <p>A new customer has successfully completed payment for garage floor coating services.</p>
              <h2>Customer Details</h2>
              <ul>
                <li><strong>Name:</strong> ${submission.name}</li>
                <li><strong>Email:</strong> ${submission.email}</li>
                <li><strong>Phone:</strong> ${submission.phone}</li>
                <li><strong>Location:</strong> ${submission.location}</li>
              </ul>
              <h2>Order Details</h2>
              <ul>
                <li><strong>Garage Capacity:</strong> ${submission.garage_capacity}-Car Garage</li>
                <li><strong>Garage Finish:</strong> ${submission.garage_finish}</li>
                <li><strong>Stem Walls:</strong> ${submission.need_stem_walls === 'yes' ? `Yes, ${submission.stem_wall_type}` : 'No'}</li>
                <li><strong>House Steps:</strong> ${submission.need_steps === 'yes' ? 'Yes' : 'No'}</li>
                <li><strong>Extra Footage:</strong> ${submission.need_extra_footage === 'yes' ? submission.extra_footage : 'No'}</li>
                <li><strong>Current Condition:</strong> ${submission.current_condition}</li>
                <li><strong>Preferred Installation Date:</strong> ${formattedDate}</li>
              </ul>
              <h2>Payment Details</h2>
              <ul>
                <li><strong>Total Amount:</strong> $${submission.total_price}</li>
                <li><strong>Discount Applied:</strong> ${submission.discount_percentage ? `${submission.discount_percentage}%` : 'None'}</li>
                <li><strong>Discount Code:</strong> ${submission.discount_code || 'None'}</li>
                <li><strong>Payment Status:</strong> Completed</li>
                <li><strong>Checkout Session ID:</strong> ${submission.checkout_session_id}</li>
                <li><strong>Payment Intent ID:</strong> ${submission.payment_intent_id}</li>
              </ul>
              <p>Please contact the customer as soon as possible to confirm installation details.</p>
            `;
            
            const emailResult = await resend.emails.send({
              from: 'American Concrete Coatings <no-reply@homestop.us>',
              to: ['bipin@homestop.us', 'nithin@homestop.us'],
              subject: `New Payment Complete - ${submission.name}`,
              html: emailContent,
            });
            
            console.log("Email notification sent:", emailResult);
          } catch (emailError) {
            console.error("Error sending email notification:", emailError);
          }
        }
      } else {
        console.warn("Checkout session completed but no submission_id found in metadata");
      }
    }

    // Return a success response
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
