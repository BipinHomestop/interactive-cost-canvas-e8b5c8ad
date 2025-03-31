
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

    // Parse request data with error handling
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid request format" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    const {
      lineItems,
      totalAmount,
      metadata,
      successUrl,
      cancelUrl
    } = requestData;
    
    // Validate required parameters
    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid line items" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    if (!successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: "Missing success or cancel URL" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      return new Response(
        JSON.stringify({ error: "Configuration error: Stripe key missing" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2022-11-15",
    });
    
    console.log("Creating Stripe checkout session...");
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: metadata || {},
    });
    
    console.log("Checkout session created:", session.id);
    
    // If we have a submission_id in the metadata, update the record
    if (metadata && metadata.submission_id) {
      console.log("Updating submission record:", metadata.submission_id);
      await supabaseClient
        .from('cost_calculator_submissions')
        .update({
          checkout_session_id: session.id,
          payment_status: 'checkout_started',
          total_price: totalAmount,
          discount_code: metadata.coupon_code !== 'none' ? metadata.coupon_code : null,
          discount_percentage: metadata.discount_percentage !== '0' ? parseFloat(metadata.discount_percentage) : null
        })
        .eq('id', metadata.submission_id);
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
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
