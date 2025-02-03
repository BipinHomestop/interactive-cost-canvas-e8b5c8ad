import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log('Hello from get-secret function!')

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

    const { secretName } = await req.json()
    console.log('Requesting secret:', secretName)
    
    const secret = Deno.env.get(secretName)
    
    if (!secret) {
      console.error(`Secret ${secretName} not found`)
      return new Response(
        JSON.stringify({ error: `Secret ${secretName} not found` }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404,
        },
      )
    }

    console.log('Secret retrieved successfully')
    const data = {
      [secretName]: secret
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in get-secret function:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})