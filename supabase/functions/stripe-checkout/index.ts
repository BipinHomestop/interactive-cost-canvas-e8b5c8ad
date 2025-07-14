
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.16.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

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
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify(requestData));
    
    const {
      lineItems,
      totalAmount,
      metadata,
      successUrl,
      cancelUrl
    } = requestData;
    
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error("No line items provided");
    }

    // Validate that we have a submission ID
    if (!metadata || !metadata.submission_id) {
      console.error("Missing submission_id in metadata");
      throw new Error("Missing submission ID. Please complete the previous steps first.");
    }

    // First try to get the restricted key, fall back to the secret key if not available
    const stripeApiKey = Deno.env.get("STRIPE_RESTRICTED_KEY") || Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeApiKey) {
      console.error("Neither STRIPE_RESTRICTED_KEY nor STRIPE_SECRET_KEY environment variables are set");
      throw new Error("Stripe configuration is incomplete. Please contact support.");
    }

    // Create a new Stripe instance for each request to avoid global state issues
    console.log("Using Stripe API key to create session");
    const stripe = new Stripe(stripeApiKey, {
      apiVersion: "2022-11-15",
    });
    
    console.log("Creating checkout session with:", {
      lineItems: lineItems.length,
      totalAmount,
      successUrl,
      cancelUrl,
      metadata: { ...metadata, submission_id: metadata.submission_id }
    });
    
    // Check if we've already created a session for this submission
    const { data: existingSubmissions, error: submissionError } = await supabaseClient
      .from('cost_calculator_submissions')
      .select('checkout_session_id')
      .eq('id', metadata.submission_id)
      .maybeSingle();

    if (submissionError) {
      console.error("Error checking for existing session:", submissionError);
    }

    // If there's an existing session ID, try to retrieve it first
    let session;
    if (existingSubmissions?.checkout_session_id) {
      try {
        console.log("Found existing session ID:", existingSubmissions.checkout_session_id);
        session = await stripe.checkout.sessions.retrieve(existingSubmissions.checkout_session_id);
        
        // If session is expired or completed, create a new one
        if (session.status === 'expired' || session.status === 'complete') {
          console.log("Existing session is", session.status, ", creating a new one");
          session = null;
        } else {
          console.log("Reusing existing session");
        }
      } catch (err) {
        console.error("Error retrieving existing session:", err);
        session = null;
      }
    }

    // Create a new session if needed
    if (!session) {
      // Create a checkout session
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata,
      });
      
      console.log("Checkout session created:", session.id);
    }
    
    // If we have a submission_id in the metadata, update the record
    if (metadata && metadata.submission_id) {
      console.log("Updating submission record:", metadata.submission_id);
      
      const { error } = await supabaseClient
        .from('cost_calculator_submissions')
        .update({
          checkout_session_id: session.id,
          payment_status: 'checkout_started',
          total_price: totalAmount,
          discount_code: metadata.coupon_code !== 'none' ? metadata.coupon_code : null,
          discount_percentage: metadata.discount_percentage !== '0' ? parseFloat(metadata.discount_percentage) : null
        })
        .eq('id', metadata.submission_id);
        
      if (error) {
        console.error("Error updating submission:", error);
      } else {
        console.log("Submission updated successfully");
      }
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    
    // Enhanced error logging for debugging
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
