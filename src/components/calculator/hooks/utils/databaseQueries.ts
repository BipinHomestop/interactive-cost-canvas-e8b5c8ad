
import { supabase } from "@/integrations/supabase/client";
import { CalculatorInputs } from "../../types";
import { withRetry, handleDatabaseError } from "@/hooks/calculator/utils/database-retry";

export const getFinishCollectionImage = async (garageFinish: string) => {
  return withRetry(async () => {
    console.log('Fetching finish collection image for:', garageFinish);
    const { data, error } = await supabase
      .from('garage_finish_image_collections')
      .select('*')
      .eq('finish_type', garageFinish)
      .maybeSingle();
      
    if (error) {
      throw handleDatabaseError(error, 'fetch finish collection image');
    }
    console.log('Retrieved finish collection data:', data ? 'found' : 'not found');
    return data;
  });
};

// Note: updateStepImagesLastSelected and insertStepImage removed.
// calculator_step_images is admin-managed content only.
// User selections are tracked in React state.

export const getLastSelectedImage = async (stepNumber: number) => {
  return withRetry(async () => {
    console.log('Fetching last selected image for step:', stepNumber);
    const { data, error } = await supabase
      .from('calculator_step_images')
      .select('image_path')
      .eq('step_number', stepNumber)
      .eq('is_last_selected', true)
      .maybeSingle();

    if (error) {
      throw handleDatabaseError(error, 'fetch last selected image');
    }
    console.log('Retrieved last selected image:', data ? 'found' : 'not found');
    return data;
  });
};

export const getStepImage = async (stepNumber: number, imageType: string) => {
  return withRetry(async () => {
    console.log('Fetching image for step:', stepNumber, 'type:', imageType);
    const { data, error } = await supabase
      .from('calculator_step_images')
      .select('*')
      .eq('step_number', stepNumber)
      .eq('image_type', imageType)
      .maybeSingle();

    if (error) {
      throw handleDatabaseError(error, 'fetch step image');
    }
    
    console.log('Retrieved image data:', data ? 'found' : 'not found');
    return data;
  });
};

