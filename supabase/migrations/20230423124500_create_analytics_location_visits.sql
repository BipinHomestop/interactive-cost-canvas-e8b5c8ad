
-- Create a table to store anonymous location visits for analytics
CREATE TABLE IF NOT EXISTS public.analytics_location_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT,
  region TEXT,
  zipcode TEXT,
  country TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  ip_hash TEXT, -- Store only a hash of IP for privacy
  visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
  visit_time TIME NOT NULL DEFAULT CURRENT_TIME,
  time_range TEXT, -- To track which time range was selected
  page_visited TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index for faster queries
CREATE INDEX idx_analytics_location_visits_date ON public.analytics_location_visits(visit_date);
CREATE INDEX idx_analytics_location_visits_city ON public.analytics_location_visits(city);
CREATE INDEX idx_analytics_location_visits_zipcode ON public.analytics_location_visits(zipcode);

-- Enable RLS but allow all inserts (for anonymous tracking)
ALTER TABLE public.analytics_location_visits ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (anonymous tracking) - fixed policy
CREATE POLICY "Allow anonymous inserts" 
  ON public.analytics_location_visits 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Only allow select to authenticated users
CREATE POLICY "Allow authenticated select" 
  ON public.analytics_location_visits 
  FOR SELECT 
  TO authenticated
  USING (true);
