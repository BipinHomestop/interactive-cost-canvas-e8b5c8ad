-- Fix all remaining Function Search Path Mutable warnings
-- Update log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text, 
  user_id uuid DEFAULT NULL::uuid, 
  ip_address text DEFAULT NULL::text, 
  user_agent text DEFAULT NULL::text, 
  details jsonb DEFAULT NULL::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.security_audit_log (event_type, user_id, ip_address, user_agent, details)
  VALUES (event_type, user_id, ip_address, user_agent, details);
END;
$function$;

-- Update is_admin_user function
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = auth.uid() AND is_active = true
  );
END;
$function$;

-- Update has_admin_users function
CREATE OR REPLACE FUNCTION public.has_admin_users()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE is_active = true);
END;
$function$;