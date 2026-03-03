-- Add admin management policy for calculator_pricing_config
-- Table already has RLS enabled and SELECT policies, but missing write policies for admins
CREATE POLICY "Admins can manage pricing config"
ON public.calculator_pricing_config
FOR ALL
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());