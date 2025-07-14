
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

export const updateStepImagesLastSelected = async (stepNumber: number) => {
  return withRetry(async () => {
    console.log('Updating last selected images for step:', stepNumber);
    const { error } = await supabase
      .from('calculator_step_images')
      .update({ is_last_selected: false })
      .eq('step_number', stepNumber);

    if (error) {
      throw handleDatabaseError(error, 'update step images last selected');
    }
  });
};

export const insertStepImage = async (
  stepNumber: number,
  imageType: string,
  imagePath: string,
  isLastSelected: boolean = false
) => {
  return withRetry(async () => {
    console.log('Inserting step image:', { stepNumber, imageType, imagePath, isLastSelected });
    
    const { data: existingImage, error: fetchError } = await supabase
      .from('calculator_step_images')
      .select('id')
      .eq('step_number', stepNumber)
      .eq('image_type', imageType)
      .maybeSingle();

    if (fetchError) {
      throw handleDatabaseError(fetchError, 'fetch existing step image');
    }

    if (existingImage) {
      console.log('Updating existing image with id:', existingImage.id);
      const { error: updateError } = await supabase
        .from('calculator_step_images')
        .update({
          image_path: imagePath,
          is_last_selected: isLastSelected
        })
        .eq('id', existingImage.id);

      if (updateError) {
        throw handleDatabaseError(updateError, 'update step image');
      }
    } else {
      console.log('Inserting new step image');
      const { error: insertError } = await supabase
        .from('calculator_step_images')
        .insert({
          step_number: stepNumber,
          image_type: imageType,
          image_path: imagePath,
          is_last_selected: isLastSelected
        });

      if (insertError) {
        throw handleDatabaseError(insertError, 'insert step image');
      }
    }
  });
};

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

