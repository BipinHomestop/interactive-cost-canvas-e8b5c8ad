import { supabase } from "@/integrations/supabase/client";
import { CalculatorInputs } from "@/components/calculator/types";

/**
 * Creates a new submission in the database
 */
export const createSubmission = async (
  formValues: Partial<CalculatorInputs>,
  totalPrice?: number,
  discountCode?: string,
  discountPercentage?: number
) => {
  const { data, error } = await supabase
    .from('cost_calculator_submissions')
    .insert([{
      location: formValues.location || '',
      name: formValues.name || '',
      phone: formValues.phone || '',
      email: formValues.email || '',
      garage_capacity: formValues.garageCapacity || null,
      garage_finish: formValues.garageFinish || 'snowfall', // Default value
      need_stem_walls: formValues.needStemWalls || 'no',
      stem_wall_type: formValues.stemWallType,
      need_steps: formValues.needSteps,
      need_extra_footage: formValues.needExtraFootage,
      extra_footage: formValues.extraFootage,
      current_condition: formValues.currentCondition,
      total_price: totalPrice,
      discount_code: discountCode,
      discount_percentage: discountPercentage,
      payment_status: 'incomplete' // Mark as incomplete until payment step
    }])
    .select();

  return { data, error };
};

/**
 * Updates an existing submission in the database
 */
export const updateSubmission = async (
  submissionId: string,
  updateData: Record<string, any>
) => {
  const { error } = await supabase
    .from('cost_calculator_submissions')
    .update(updateData)
    .eq('id', submissionId);

  return { error };
};

/**
 * Builds an update object from form values
 */
export const buildUpdateObject = (
  formValues: Partial<CalculatorInputs>,
  totalPrice?: number,
  discountCode?: string,
  discountPercentage?: number
): Record<string, any> => {
  const updateData: Record<string, any> = {};
  
  // Only include fields that have values
  if (formValues.garageCapacity !== undefined) updateData.garage_capacity = formValues.garageCapacity;
  if (formValues.garageFinish !== undefined) updateData.garage_finish = formValues.garageFinish;
  if (formValues.needStemWalls !== undefined) updateData.need_stem_walls = formValues.needStemWalls;
  if (formValues.stemWallType !== undefined) updateData.stem_wall_type = formValues.stemWallType;
  if (formValues.needSteps !== undefined) updateData.need_steps = formValues.needSteps;
  if (formValues.needExtraFootage !== undefined) updateData.need_extra_footage = formValues.needExtraFootage;
  if (formValues.extraFootage !== undefined) updateData.extra_footage = formValues.extraFootage;
  if (formValues.currentCondition !== undefined) updateData.current_condition = formValues.currentCondition;
  if (formValues.location !== undefined) updateData.location = formValues.location;
  if (formValues.name !== undefined) updateData.name = formValues.name;
  if (formValues.phone !== undefined) updateData.phone = formValues.phone;
  if (formValues.email !== undefined) updateData.email = formValues.email;
  
  // Add optional fields
  if (totalPrice !== undefined) updateData.total_price = totalPrice;
  if (discountCode !== undefined) updateData.discount_code = discountCode;
  if (discountPercentage !== undefined) updateData.discount_percentage = discountPercentage;

  // Update payment status to 'pending' if we reach the last step
  if (formValues.currentCondition !== undefined) {
    updateData.payment_status = 'pending';
  }

  return updateData;
};

/**
 * Updates payment information for a submission
 */
export const updatePaymentInfo = async (
  submissionId: string,
  updateData: Record<string, any>
) => {
  const { error } = await supabase
    .from('cost_calculator_submissions')
    .update(updateData)
    .eq('id', submissionId);

  return { error };
};

/**
 * Preserves calculation data in session storage when navigating back from payment
 */
export const preserveCalculationData = (totalPrice: number) => {
  if (totalPrice > 0) {
    // Store the current total price to preserve it when returning from payment screen
    sessionStorage.setItem('preservedTotalPrice', totalPrice.toString());
    console.log('Preserved total price in session storage:', totalPrice);
  }
};

/**
 * Retrieves preserved calculation data from session storage
 */
export const getPreservedCalculationData = (): number | null => {
  const preservedPrice = sessionStorage.getItem('preservedTotalPrice');
  if (preservedPrice) {
    const parsedPrice = parseInt(preservedPrice, 10);
    console.log('Retrieved preserved price from session storage:', parsedPrice);
    return parsedPrice;
  }
  return null;
};
