
-- Update database types to include analytics_location_visits table
SELECT
  pg_catalog.set_config('search_path', '', false);

-- Add the analytics_location_visits table to the types
-- This will ensure TypeScript can recognize the table
