-- Fix UUID generation functions and add missing triggers
-- Replace deprecated uuid_generate_v4() with gen_random_uuid()
ALTER TABLE garage_finish_image_collections ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add missing trigger for timestamp updates on calculator_pricing_config
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_calculator_pricing_config_updated_at
    BEFORE UPDATE ON calculator_pricing_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Standardize timestamp handling
ALTER TABLE calculator_pricing_config ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE calculator_pricing_config ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

-- Optimize indexes - remove redundant ones and add missing ones
DROP INDEX IF EXISTS idx_analytics_location_visits_date;
DROP INDEX IF EXISTS idx_analytics_location_visits_city;
DROP INDEX IF EXISTS idx_analytics_location_visits_zipcode;

-- Create composite indexes for better query performance
CREATE INDEX idx_analytics_location_visits_date_city ON analytics_location_visits(visit_date, city);
CREATE INDEX idx_analytics_location_visits_zipcode_date ON analytics_location_visits(zipcode, visit_date);
CREATE INDEX idx_analytics_location_visits_page_date ON analytics_location_visits(page_visited, visit_date);

-- Add index for calculator step images
CREATE INDEX idx_calculator_step_images_step_type ON calculator_step_images(step_number, image_type);
CREATE INDEX idx_calculator_step_images_last_selected ON calculator_step_images(step_number, is_last_selected) WHERE is_last_selected = true;