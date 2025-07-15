import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if any admin users already exist
    const { data: existingAdmins, error: checkError } = await supabaseClient
      .from('admin_users')
      .select('id')
      .eq('is_active', true)

    if (checkError) {
      throw checkError
    }

    if (existingAdmins && existingAdmins.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Admin user already exists' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create the auth user
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      throw authError
    }

    // Create the admin user record
    const { error: adminError } = await supabaseClient
      .from('admin_users')
      .insert({
        id: authUser.user.id,
        email: authUser.user.email,
        password_hash: 'managed_by_auth', // Placeholder since auth handles passwords
        is_active: true,
      })

    if (adminError) {
      // Clean up the auth user if admin creation fails
      await supabaseClient.auth.admin.deleteUser(authUser.user.id)
      throw adminError
    }

    // Log the admin creation
    await supabaseClient.rpc('log_security_event', {
      event_type: 'admin_user_created',
      user_id: authUser.user.id,
      details: { email }
    })

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully',
        user: { id: authUser.user.id, email: authUser.user.email }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Admin setup error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})