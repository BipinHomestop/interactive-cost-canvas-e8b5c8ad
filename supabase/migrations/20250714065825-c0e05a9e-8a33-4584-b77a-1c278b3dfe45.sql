-- Fix Function Search Path Mutable warnings by setting secure search_path for all functions

-- Fix generate_public_url function
CREATE OR REPLACE FUNCTION public.generate_public_url()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
begin
  new.garage_finish_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.garage_finish_image;
  new.stem_wall_standard_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.stem_wall_standard_image;
  new.stem_wall_large_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.stem_wall_large_image;
  new.stem_wall_no_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.stem_wall_no_image;
  new.stemwall_yes_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.stemwall_yes_image;
  new.steps_yes_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.steps_yes_image;
  new.steps_no_image := 'https://tseksgdxfldgppzgfcwl.supabase.co/storage/v1/object/public/garage-images/' || new.steps_no_image;
  return new;
end;
$function$;

-- Fix update_last_selected function
CREATE OR REPLACE FUNCTION public.update_last_selected()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
    IF NEW.is_last_selected THEN
        UPDATE public.calculator_step_images
        SET is_last_selected = false
        WHERE step_number = NEW.step_number
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$function$;

-- Fix is_valid_us_zipcode function
CREATE OR REPLACE FUNCTION public.is_valid_us_zipcode(zipcode text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path = ''
AS $function$
BEGIN
  RETURN zipcode ~ '^[0-9]{5}$';
END;
$function$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$;