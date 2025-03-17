
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
    
    console.log('Creating checkout session with items:', JSON.stringify(lineItems))
    console.log('Total amount:', totalAmount)
    console.log('Metadata:', JSON.stringify(metadata))
    console.log('Success URL:', successUrl)
    console.log('Cancel URL:', cancelUrl)

    // Prepare line items for Stripe - handle discounts separately
    const stripeLineItems = lineItems.filter(item => item.price_data.unit_amount > 0).map(item => ({
      price_data: {
        currency: item.price_data.currency,
        product_data: {
          name: item.price_data.product_data.name,
        },
        unit_amount: item.price_data.unit_amount,
      },
      quantity: item.quantity
    }));

    console.log('Formatted line items for Stripe:', JSON.stringify(stripeLineItems))

    // Create customer data object if customer details are provided
    const customerDetails = {
      name: metadata.customer_name,
      email: metadata.customer_email,
      phone: metadata.customer_phone,
    };

    console.log('Customer details:', JSON.stringify(customerDetails));

    // Create a Stripe checkout session
    let discountOption = undefined;
    if (metadata.discount_percentage && parseFloat(metadata.discount_percentage) > 0) {
      try {
        const couponId = await createOrRetrieveCoupon(parseFloat(metadata.discount_percentage));
        discountOption = [{
          coupon: couponId,
        }];
        console.log('Applied discount with coupon:', couponId);
      } catch (discountError) {
        console.error('Error applying discount:', discountError.message);
        // Continue without discount if there's an error
      }
    }

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: successUrl || 'https://your-site.com/success',
      cancel_url: cancelUrl || 'https://your-site.com/cancel',
      metadata: metadata || {},
      discounts: discountOption,
      customer_email: customerDetails.email,
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
    };

    console.log('Session configuration:', JSON.stringify(sessionConfig));

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log('Checkout session created:', session.id);
    console.log('Checkout URL:', session.url);

    // Return the checkout session ID and URL
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
    console.error('Full error details:', JSON.stringify(error))
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || 'No stack trace available'
      }),
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
    console.log(`Trying to retrieve coupon: ${couponId}`);
    const existingCoupon = await stripe.coupons.retrieve(couponId);
    console.log('Found existing coupon:', existingCoupon.id);
    return existingCoupon.id;
  } catch (error) {
    // If coupon doesn't exist, create a new one
    console.log(`Coupon ${couponId} not found, creating new one with ${discountPercentage}% off`);
    try {
      const newCoupon = await stripe.coupons.create({
        id: couponId,
        percent_off: discountPercentage,
        duration: 'once',
      });
      console.log('Created new coupon:', newCoupon.id);
      return newCoupon.id;
    } catch (createError) {
      console.error('Error creating coupon:', createError.message);
      throw createError;
    }
  }
}
