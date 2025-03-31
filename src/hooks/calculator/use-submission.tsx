
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "@/components/calculator/types";

export const useSubmission = () => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Helper function to validate ZIP code format
  const isValidZipCode = (zipcode: string | undefined): boolean => {
    if (!zipcode) return false;
    return /^\d{5}$/.test(zipcode); // Must be exactly 5 digits
  };

  const saveSubmission = async (
    formValues: Partial<CalculatorInputs>, 
    isNewSubmission: boolean = true,
    totalPrice?: number,
    discountCode?: string,
    discountPercentage?: number
  ) => {
    try {
      // Validate ZIP code format before saving
      if (isNewSubmission && (!formValues.location || !isValidZipCode(formValues.location))) {
        toast({
          title: "Error",
          description: "Please enter a valid 5-digit ZIP code before continuing",
          variant: "destructive",
        });
        return false;
      }

      if (isNewSubmission) {
        // For new submissions, save whatever data we have so far
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

        if (error) {
          console.error('Database error:', error);
          
          let errorMessage = "Failed to save your information";
          if (error.code === '23514' && error.message.includes('valid_zipcode_format')) {
            errorMessage = "Please enter a valid 5-digit ZIP code";
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
          return false;
        }

        if (data && data[0]) {
          setSubmissionId(data[0].id);
          console.log('Saved new submission with ID:', data[0].id);
        }

        toast({
          title: "Success",
          description: "Your information has been saved",
          className: "bg-green-500 text-white border-none",
        });
      } else if (submissionId) {
        // For updates, create update object with only non-undefined values
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

        const { error } = await supabase
          .from('cost_calculator_submissions')
          .update(updateData)
          .eq('id', submissionId);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Updated submission with ID:', submissionId);
      }
      return true;
    } catch (error) {
      console.error('Error saving/updating data:', error);
      toast({
        title: "Error",
        description: isNewSubmission ? "Failed to save your information" : "Failed to update your information",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePaymentInfo = async (
    preferredInstallationDate?: Date,
    checkoutSessionId?: string,
    paymentStatus?: string
  ) => {
    if (!submissionId) {
      console.error('No submission ID found for payment update');
      return false;
    }
    
    try {
      console.log('Updating payment info with:', {
        date: preferredInstallationDate,
        sessionId: checkoutSessionId,
        status: paymentStatus
      });
      
      // Convert Date object to ISO string format before sending to the database
      const formattedDate = preferredInstallationDate 
        ? preferredInstallationDate.toISOString().split('T')[0] 
        : undefined;
      
      const updateData: Record<string, any> = {};
      
      if (formattedDate) updateData.preferred_installation_date = formattedDate;
      if (checkoutSessionId) updateData.checkout_session_id = checkoutSessionId;
      if (paymentStatus) updateData.payment_status = paymentStatus;
      
      const { error } = await supabase
        .from('cost_calculator_submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (error) {
        console.error('Payment info update error:', error);
        throw error;
      }
      
      console.log('Successfully updated payment info for submission:', submissionId);
      return true;
    } catch (error) {
      console.error('Error updating payment information:', error);
      return false;
    }
  };

  return { submissionId, saveSubmission, updatePaymentInfo };
};
