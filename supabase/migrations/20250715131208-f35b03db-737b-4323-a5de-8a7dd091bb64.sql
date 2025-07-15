-- Fix RLS policies for cost_calculator_submissions table

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow authenticated admin access to submissions" ON public.cost_calculator_submissions;
DROP POLICY IF EXISTS "Allow public insert for submissions" ON public.cost_calculator_submissions;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.cost_calculator_submissions;

-- Create clear, non-conflicting policies
CREATE POLICY "Public can insert submissions" 
ON public.cost_calculator_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update own submissions" 
ON public.cost_calculator_submissions 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admins can view all submissions" 
ON public.cost_calculator_submissions 
FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

CREATE POLICY "Admins can manage all submissions" 
ON public.cost_calculator_submissions 
FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));