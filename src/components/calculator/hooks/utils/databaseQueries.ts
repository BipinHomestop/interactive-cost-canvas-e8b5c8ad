
import { supabase } from "@/integrations/supabase/client";
import { CalculatorInputs } from "../../types";

export const getFinishCollectionImage = async (garageFinish: string) => {
  console.log('Getting finish collection for:', garageFinish);
  const { data, error } = await supabase
    .from('garage_finish_image_collections')
    .select('*')
    .eq('finish_type', garageFinish)
    .maybeSingle();
    
  if (error) {
    console.error('Error fetching finish collection:', error);
    throw error;
  }
  
  console.log('Finish collection data:', data);
  return data;
};

export const updateStepImagesLastSelected = async (stepNumber: number) => {
  console.log('Updating last selected for step:', stepNumber);
  const { error } = await supabase
    .from('calculator_step_images')
    .update({ is_last_selected: false })
    .eq('step_number', stepNumber);

  if (error) {
    console.error('Error updating last selected:', error);
    throw error;
  }
};

export const insertStepImage = async (
  stepNumber: number,
  imageType: string,
  imagePath: string,
  isLastSelected: boolean = false
) => {
  console.log('Inserting/updating step image:', { stepNumber, imageType, imagePath, isLastSelected });
  
  const { data: existingImage, error: fetchError } = await supabase
    .from('calculator_step_images')
    .select('id')
    .eq('step_number', stepNumber)
    .eq('image_type', imageType)
    .maybeSingle();

  if (fetchError) {
    console.error('Error checking existing image:', fetchError);
    throw fetchError;
  }

  if (existingImage) {
    console.log('Updating existing image:', existingImage.id);
    const { error: updateError } = await supabase
      .from('calculator_step_images')
      .update({
        image_path: imagePath,
        is_last_selected: isLastSelected
      })
      .eq('id', existingImage.id);

    if (updateError) {
      console.error('Error updating image:', updateError);
      throw updateError;
    }
  } else {
    console.log('Inserting new image');
    const { error: insertError } = await supabase
      .from('calculator_step_images')
      .insert({
        step_number: stepNumber,
        image_type: imageType,
        image_path: imagePath,
        is_last_selected: isLastSelected
      });

    if (insertError) {
      console.error('Error inserting image:', insertError);
      throw insertError;
    }
  }
  
  console.log('Successfully inserted/updated image');
};

export const getLastSelectedImage = async (stepNumber: number) => {
  console.log('Getting last selected image for step:', stepNumber);
  const { data, error } = await supabase
    .from('calculator_step_images')
    .select('image_path')
    .eq('step_number', stepNumber)
    .eq('is_last_selected', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching last selected image:', error);
    throw error;
  }
  
  console.log('Last selected image data:', data);
  return data;
};

export const getStepImage = async (stepNumber: number, imageType: string) => {
  console.log('Fetching image for step:', stepNumber, 'type:', imageType);
  const { data, error } = await supabase
    .from('calculator_step_images')
    .select('*')
    .eq('step_number', stepNumber)
    .eq('image_type', imageType)
    .maybeSingle();

  if (error) {
    console.error('Error fetching step image:', error);
    throw error;
  }
  
  console.log('Retrieved image data:', data);
  return data;
};
