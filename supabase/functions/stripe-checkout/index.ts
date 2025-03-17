
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

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || 'https://your-site.com/success',
      cancel_url: cancelUrl || 'https://your-site.com/cancel',
      metadata: metadata || {},
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
