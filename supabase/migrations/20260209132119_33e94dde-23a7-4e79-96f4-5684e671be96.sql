
-- 1. Fix submission_session_tokens: Add RLS policies (currently has RLS enabled but no policies)
CREATE POLICY "Service role only for session tokens"
ON public.submission_session_tokens FOR ALL
USING (false)
WITH CHECK (false);

-- 2. Fix service_area_zipcodes: Replace overly permissive policy with admin-only
DROP POLICY IF EXISTS "Allow authenticated users to modify service_area_zipcodes" ON public.service_area_zipcodes;
CREATE POLICY "Admins can manage service_area_zipcodes"
ON public.service_area_zipcodes FOR ALL TO authenticated
USING (is_admin_user()) WITH CHECK (is_admin_user());

-- 3. Fix discount_codes: Remove overly permissive policy (admin-only policy already exists)
DROP POLICY IF EXISTS "Allow authenticated users to modify discount_codes" ON public.discount_codes;

-- 4. Fix validate_discount_code: Harden search_path
CREATE OR REPLACE FUNCTION public.validate_discount_code(code_to_check text)
RETURNS TABLE(is_valid boolean, discount_percentage integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  code_record RECORD;
BEGIN
  SELECT * INTO code_record
  FROM public.discount_codes
  WHERE code = code_to_check
    AND active = true
    AND (expires_at IS NULL OR expires_at > now());

  IF code_record.id IS NOT NULL THEN
    RETURN QUERY SELECT true, code_record.discount_percentage;
  ELSE
    RETURN QUERY SELECT false, 0;
  END IF;
END;
$$;

-- 5. Fix admin_users: Add explicit SELECT restriction
CREATE POLICY "Only admins can read admin_users"
ON public.admin_users FOR SELECT TO authenticated
USING (is_admin_user());
