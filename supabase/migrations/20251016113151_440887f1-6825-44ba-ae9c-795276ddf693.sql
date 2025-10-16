-- =========================================
-- Fix Critical Security Issues
-- =========================================

-- 1. FIX: cost_calculator_submissions - Remove public access, restrict to admin only
-- =========================================

-- Drop the dangerous "Allow all operations for everyone" policy
DROP POLICY IF EXISTS "Allow all operations for everyone" ON public.cost_calculator_submissions;

-- Allow anonymous users to INSERT their initial submission (for the calculator form)
CREATE POLICY "Allow anonymous submission creation"
ON public.cost_calculator_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated admin users to SELECT all submissions
CREATE POLICY "Admins can view all submissions"
ON public.cost_calculator_submissions
FOR SELECT
TO authenticated
USING (is_admin_user());

-- Allow authenticated admin users to UPDATE submissions
CREATE POLICY "Admins can update submissions"
ON public.cost_calculator_submissions
FOR UPDATE
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Allow authenticated admin users to DELETE submissions
CREATE POLICY "Admins can delete submissions"
ON public.cost_calculator_submissions
FOR DELETE
TO authenticated
USING (is_admin_user());


-- 2. FIX: analytics_location_visits - Restrict INSERT to service role only
-- =========================================

-- Drop the public insert policy
DROP POLICY IF EXISTS "Allow system inserts on analytics" ON public.analytics_location_visits;

-- Only service role can insert analytics data (from edge functions)
CREATE POLICY "Service role can insert analytics"
ON public.analytics_location_visits
FOR INSERT
TO service_role
WITH CHECK (true);

-- Keep admin access for viewing analytics (already exists, but ensure it's there)
-- Policy "Allow authenticated admin select on analytics" should already exist


-- 3. FIX: discount_codes - Remove public SELECT, add validation function
-- =========================================

-- Drop the public read policy
DROP POLICY IF EXISTS "Allow public read access to discount_codes" ON public.discount_codes;

-- Create a secure function to validate discount codes without exposing all codes
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  code_to_check text
)
RETURNS TABLE(
  is_valid boolean,
  discount_percentage integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Find the code
  SELECT * INTO code_record
  FROM public.discount_codes
  WHERE code = code_to_check
    AND active = true
    AND (expires_at IS NULL OR expires_at > now());

  -- Return validation result
  IF code_record.id IS NOT NULL THEN
    RETURN QUERY SELECT true, code_record.discount_percentage;
  ELSE
    RETURN QUERY SELECT false, 0;
  END IF;
END;
$$;

-- Allow authenticated admins to manage discount codes
CREATE POLICY "Admins can manage discount codes"
ON public.discount_codes
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());

-- Grant execute permission on the validation function to anon users
GRANT EXECUTE ON FUNCTION public.validate_discount_code(text) TO anon, authenticated;