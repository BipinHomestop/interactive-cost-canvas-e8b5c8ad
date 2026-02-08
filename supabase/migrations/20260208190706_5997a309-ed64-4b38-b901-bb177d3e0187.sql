-- Remove the overly permissive policy that grants ALL operations to service role
DROP POLICY IF EXISTS "Service role can manage all analytics data" ON public.analytics_location_visits;

-- The existing policies remain:
-- 1. "Service role can insert analytics" (FOR INSERT) - needed for data collection
-- 2. "Allow authenticated admin select on analytics" (FOR SELECT) - admin viewing only