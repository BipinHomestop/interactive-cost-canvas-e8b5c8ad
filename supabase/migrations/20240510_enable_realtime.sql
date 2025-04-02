
-- Enable realtime for the analytics_location_visits table
ALTER TABLE analytics_location_visits REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_location_visits;
