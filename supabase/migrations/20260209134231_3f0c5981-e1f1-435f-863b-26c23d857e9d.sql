-- Tighten anonymous submission INSERT policy
-- Note: Using location-only validation since progressive submission 
-- creates records at Step 1 with empty strings for name/email/phone
DROP POLICY IF EXISTS "Allow anonymous submission creation" 
  ON public.cost_calculator_submissions;

CREATE POLICY "Allow anonymous submission creation" 
  ON public.cost_calculator_submissions 
  FOR INSERT TO anon
  WITH CHECK (
    location IS NOT NULL AND location <> '' AND
    garage_capacity IS NOT NULL AND
    garage_finish IS NOT NULL AND
    need_stem_walls IS NOT NULL
  );