import { supabase } from "@/integrations/supabase/client";
import { CalculatorInputs } from "@/components/calculator/types";
import { withRetry, handleDatabaseError } from "./database-retry";
import { InputSanitizer } from "@/components/security/InputSanitizer";

/**
 * Creates a new submission in the database
 */
export const createSubmission = async (
  formValues: Partial<CalculatorInputs>,
  totalPrice?: number,
  discountCode?: string,
  discountPercentage?: number
) => {
  return withRetry(async () => {
    // Build sanitized data object - only sanitize fields that exist
    const submissionData: any = {
      garage_capacity: formValues.garageCapacity || null,
      garage_finish: formValues.garageFinish || 'snowfall',
      need_stem_walls: formValues.needStemWalls || 'no',
      stem_wall_type: formValues.stemWallType,
      need_steps: formValues.needSteps,
      need_extra_footage: formValues.needExtraFootage,
      extra_footage: formValues.extraFootage,
      current_condition: formValues.currentCondition,
      payment_status: 'incomplete'
    };
    
    // Sanitize and validate contact fields only if they are provided
    if (formValues.location) {
      const sanitizedLocation = InputSanitizer.sanitizeZipCode(formValues.location);
      if (!sanitizedLocation) {
        throw new Error('Invalid ZIP code format');
      }
      submissionData.location = sanitizedLocation;
    } else {
      // Location is required at minimum for new submissions
      throw new Error('Location (ZIP code) is required');
    }
    
    if (formValues.name) {
      const sanitizedName = InputSanitizer.sanitizeName(formValues.name);
      if (!sanitizedName) {
        throw new Error('Invalid name format');
      }
      submissionData.name = sanitizedName;
    } else {
      submissionData.name = ''; // Will be filled later
    }
    
    if (formValues.email) {
      const sanitizedEmail = InputSanitizer.sanitizeEmail(formValues.email);
      if (!sanitizedEmail) {
        throw new Error('Invalid email format');
      }
      submissionData.email = sanitizedEmail;
    } else {
      submissionData.email = ''; // Will be filled later
    }
    
    if (formValues.phone) {
      const sanitizedPhone = InputSanitizer.sanitizePhone(formValues.phone);
      if (!sanitizedPhone) {
        throw new Error('Invalid phone format');
      }
      submissionData.phone = sanitizedPhone;
    } else {
      submissionData.phone = ''; // Will be filled later
    }
    
    // Ensure we never save a zero or negative price
    if (totalPrice && totalPrice > 0) {
      submissionData.total_price = totalPrice;
    }
    
    if (discountCode) submissionData.discount_code = discountCode;
    if (discountPercentage) submissionData.discount_percentage = discountPercentage;
    
    console.log('Creating submission with sanitized data');
    
    const { data, error } = await supabase
      .from('cost_calculator_submissions')
      .insert([submissionData])
      .select();

    if (error) {
      throw handleDatabaseError(error, 'create submission');
    }

    console.log('Created submission successfully');
    return { data, error: null };
  });
};

/**
 * Updates an existing submission in the database
 */
export const updateSubmission = async (
  submissionId: string,
  updateData: Record<string, any>
) => {
  return withRetry(async () => {
    // Ensure we never save a zero or negative price to the database
    if (updateData.total_price !== undefined && updateData.total_price <= 0) {
      console.warn('Prevented saving zero or negative price to database');
      delete updateData.total_price;
    }
    
    console.log('Updating submission:', submissionId, 'with data:', updateData);
    
    const { error } = await supabase
      .from('cost_calculator_submissions')
      .update(updateData)
      .eq('id', submissionId);

    if (error) {
      throw handleDatabaseError(error, 'update submission');
    }

    console.log('Updated submission successfully');
    return { error: null };
  });
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
  
  // Sanitize user inputs before building update object
  if (formValues.name !== undefined) {
    const sanitized = InputSanitizer.sanitizeName(formValues.name);
    if (sanitized) updateData.name = sanitized;
  }
  if (formValues.email !== undefined) {
    const sanitized = InputSanitizer.sanitizeEmail(formValues.email);
    if (sanitized) updateData.email = sanitized;
  }
  if (formValues.phone !== undefined) {
    const sanitized = InputSanitizer.sanitizePhone(formValues.phone);
    if (sanitized) updateData.phone = sanitized;
  }
  if (formValues.location !== undefined) {
    const sanitized = InputSanitizer.sanitizeZipCode(formValues.location);
    if (sanitized) updateData.location = sanitized;
  }
  
  // Only include fields that have values
  if (formValues.garageCapacity !== undefined) updateData.garage_capacity = formValues.garageCapacity;
  if (formValues.garageFinish !== undefined) updateData.garage_finish = formValues.garageFinish;
  if (formValues.needStemWalls !== undefined) updateData.need_stem_walls = formValues.needStemWalls;
  if (formValues.stemWallType !== undefined) updateData.stem_wall_type = formValues.stemWallType;
  if (formValues.needSteps !== undefined) updateData.need_steps = formValues.needSteps;
  if (formValues.needExtraFootage !== undefined) updateData.need_extra_footage = formValues.needExtraFootage;
  if (formValues.extraFootage !== undefined) updateData.extra_footage = formValues.extraFootage;
  if (formValues.currentCondition !== undefined) updateData.current_condition = formValues.currentCondition;
  
  // Add optional fields - ensuring totalPrice is valid
  if (totalPrice !== undefined && totalPrice > 0) updateData.total_price = totalPrice;
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
  return withRetry(async () => {
    // Ensure we never save a zero or negative price to the database
    if (updateData.total_price !== undefined && updateData.total_price <= 0) {
      console.warn('Prevented saving zero or negative price in payment info');
      delete updateData.total_price;
    }
    
    console.log('Updating payment info for submission:', submissionId, 'with data:', updateData);
    
    const { error } = await supabase
      .from('cost_calculator_submissions')
      .update(updateData)
      .eq('id', submissionId);

    if (error) {
      throw handleDatabaseError(error, 'update payment info');
    }

    console.log('Updated payment info successfully');
    return { error: null };
  });
};

/**
 * Preserves calculation data in session storage when navigating back from payment
 * This is a critical function to maintain price consistency in the calculator
 */
export const preserveCalculationData = (totalPrice: number) => {
  if (totalPrice > 0) {
    try {
      // Store the current total price to preserve it when returning from payment screen
      sessionStorage.setItem('preservedTotalPrice', totalPrice.toString());
      console.log('Price preserved successfully in session storage:', totalPrice);
      
      // Also store the timestamp when the price was preserved
      sessionStorage.setItem('preservedTotalPriceTimestamp', Date.now().toString());
      
      return true;
    } catch (error) {
      console.error('Error preserving total price:', error);
      return false;
    }
  }
  return false;
};

/**
 * Retrieves preserved calculation data from session storage
 * Returns the preserved price or null if not found/invalid
 */
export const getPreservedCalculationData = (): number | null => {
  try {
    const preservedPrice = sessionStorage.getItem('preservedTotalPrice');
    
    if (preservedPrice) {
      const parsedPrice = parseInt(preservedPrice, 10);
      
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        console.log('Retrieved preserved price from session storage:', parsedPrice);
        return parsedPrice;
      }
    }
    
    console.log('No valid preserved price found in session storage');
    return null;
  } catch (error) {
    console.error('Error retrieving preserved price:', error);
    return null;
  }
};
