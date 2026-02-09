-- Remove overly permissive public INSERT and UPDATE policies on calculator_step_images
DROP POLICY IF EXISTS "Allow public insert access to calculator_step_images" ON public.calculator_step_images;
DROP POLICY IF EXISTS "Allow public update access to calculator_step_images" ON public.calculator_step_images;

-- Add admin-only policies for INSERT and UPDATE
CREATE POLICY "Admins can insert calculator step images" 
ON public.calculator_step_images 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update calculator step images" 
ON public.calculator_step_images 
FOR UPDATE 
TO authenticated
USING (is_admin_user())
WITH CHECK (is_admin_user());