
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

// Initialize Stripe with the provided restricted key
const stripe = new Stripe('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', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    // Parse the request body
    const { lineItems, totalAmount, metadata, successUrl, cancelUrl } = await req.json()
    
    console.log('Creating checkout session with items:', lineItems)
    console.log('Total amount:', totalAmount)
    console.log('Metadata:', metadata)

    // Prepare line items for Stripe - handle discounts separately
    const stripeLineItems = lineItems.filter(item => item.price_data.unit_amount > 0).map(item => ({
      price_data: item.price_data,
      quantity: item.quantity
    }));

    // Create customer data object if customer details are provided
    const customerDetails = {
      name: metadata.customer_name,
      email: metadata.customer_email,
      phone: metadata.customer_phone,
    };

    console.log('Customer details:', customerDetails);

    // Create a Stripe checkout session - don't use both customer and customer_email
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: successUrl || 'https://your-site.com/success',
      cancel_url: cancelUrl || 'https://your-site.com/cancel',
      metadata: metadata || {},
      // Apply discount if present
      discounts: metadata.discount_percentage && parseFloat(metadata.discount_percentage) > 0 
        ? [{
            coupon: await createOrRetrieveCoupon(parseFloat(metadata.discount_percentage)),
          }] 
        : undefined,
      // Include customer email for customer creation but don't set customer property
      customer_email: customerDetails.email,
      customer_creation: 'always',
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    })

    console.log('Checkout session created:', session.id)

    // Return the checkout session ID
    return new Response(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in stripe-checkout function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})

// Helper function to create or retrieve a coupon with the specific discount percentage
async function createOrRetrieveCoupon(discountPercentage) {
  const couponId = `discount-${discountPercentage}`.replace('.', '-');
  
  try {
    // Try to retrieve existing coupon
    const existingCoupon = await stripe.coupons.retrieve(couponId);
    return existingCoupon.id;
  } catch (error) {
    // If coupon doesn't exist, create a new one
    try {
      const newCoupon = await stripe.coupons.create({
        id: couponId,
        percent_off: discountPercentage,
        duration: 'once',
      });
      return newCoupon.id;
    } catch (createError) {
      console.error('Error creating coupon:', createError);
      throw createError;
    }
  }
}
