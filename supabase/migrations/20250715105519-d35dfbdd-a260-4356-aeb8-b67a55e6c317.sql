-- Create admin users table for proper authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Only authenticated admins can access admin_users table
CREATE POLICY "Admins can manage admin_users" 
ON public.admin_users 
FOR ALL 
USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

-- Tighten RLS policies for analytics_location_visits
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.analytics_location_visits;
DROP POLICY IF EXISTS "Allow anonymous inserts for analytics" ON public.analytics_location_visits;
DROP POLICY IF EXISTS "Allow authenticated inserts for analytics" ON public.analytics_location_visits;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.analytics_location_visits;

-- Create more restrictive policies for analytics
CREATE POLICY "Allow authenticated admin select on analytics" 
ON public.analytics_location_visits 
FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "Allow system inserts on analytics" 
ON public.analytics_location_visits 
FOR INSERT 
WITH CHECK (true); -- Allow system to insert analytics data

-- Tighten RLS policies for cost_calculator_submissions  
DROP POLICY IF EXISTS "Enable delete for all users" ON public.cost_calculator_submissions;
DROP POLICY IF EXISTS "Enable select for all users" ON public.cost_calculator_submissions;
DROP POLICY IF EXISTS "Enable update for all users" ON public.cost_calculator_submissions;

-- Create more restrictive policies for submissions
CREATE POLICY "Allow authenticated admin access to submissions" 
ON public.cost_calculator_submissions 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "Allow public insert for submissions" 
ON public.cost_calculator_submissions 
FOR INSERT 
WITH CHECK (true); -- Allow public to create submissions

-- Create audit log table for security monitoring
CREATE TABLE public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
ON public.security_audit_log 
FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  user_id UUID DEFAULT NULL,
  ip_address TEXT DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.security_audit_log (event_type, user_id, ip_address, user_agent, details)
  VALUES (event_type, user_id, ip_address, user_agent, details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;