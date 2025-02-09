
import { supabase } from "@/integrations/supabase/client";
import { CalculatorInputs } from "../../types";

export const getFinishCollectionImage = async (garageFinish: string) => {
  const { data, error } = await supabase
    .from('garage_finish_image_collections')
    .select('*')
    .eq('finish_type', garageFinish)
    .maybeSingle();
    
  if (error) throw error;
  return data;
};

export const updateStepImagesLastSelected = async (stepNumber: number) => {
  const { error } = await supabase
    .from('calculator_step_images')
    .update({ is_last_selected: false })
    .eq('step_number', stepNumber);

  if (error) throw error;
};

export const insertStepImage = async (
  stepNumber: number,
  imageType: string,
  imagePath: string,
  isLastSelected: boolean = false
) => {
  // First try to update existing image
  const { data: existingImage, error: fetchError } = await supabase
    .from('calculator_step_images')
    .select('id')
    .eq('step_number', stepNumber)
    .eq('image_type', imageType)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingImage) {
    // Update existing image
    const { error: updateError } = await supabase
      .from('calculator_step_images')
      .update({
        image_path: imagePath,
        is_last_selected: isLastSelected
      })
      .eq('id', existingImage.id);

    if (updateError) throw updateError;
  } else {
    // Insert new image
    const { error: insertError } = await supabase
      .from('calculator_step_images')
      .insert({
        step_number: stepNumber,
        image_type: imageType,
        image_path: imagePath,
        is_last_selected: isLastSelected
      });

    if (insertError) throw insertError;
  }
};

export const getLastSelectedImage = async (stepNumber: number) => {
  const { data, error } = await supabase
    .from('calculator_step_images')
    .select('image_path')
    .eq('step_number', stepNumber)
    .eq('is_last_selected', true)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getStepImage = async (stepNumber: number, imageType: string) => {
  const { data, error } = await supabase
    .from('calculator_step_images')
    .select('image_path')
    .eq('step_number', stepNumber)
    .eq('image_type', imageType)
    .maybeSingle();

  if (error) throw error;
  return data;
};
