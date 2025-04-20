import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "@/components/calculator/types";
import { isValidZipCode } from "./utils/validation-utils";
import { 
  createSubmission, 
  updateSubmission, 
  buildUpdateObject, 
  updatePaymentInfo as updatePaymentInfoDb,
  getPreservedCalculationData
} from "./utils/submission-db";

export const useSubmission = () => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load submission ID from session storage on mount
  useEffect(() => {
    const storedId = sessionStorage.getItem('calculatorSubmissionId');
    if (storedId && !submissionId) {
      console.log('useSubmission: Recovered submission ID from session storage on init:', storedId);
      setSubmissionId(storedId);
    }
  }, [submissionId]);

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

      // Add price validation and fallback logic
      let finalPrice = totalPrice;
      
      // Check for preserved price if totalPrice is invalid
      if ((!finalPrice || finalPrice <= 0) && !isNewSubmission) {
        const preservedPrice = getPreservedCalculationData();
        if (preservedPrice && preservedPrice > 0) {
          console.log('Using preserved price for submission:', preservedPrice);
          finalPrice = preservedPrice;
        }
      }

      // Final safeguard: use fallback price if still invalid
      if (formValues.currentCondition && (!finalPrice || finalPrice <= 0)) {
        // Use garage capacity to determine fallback price
        const fallbackPrice = determineFallbackPrice(formValues.garageCapacity);
        console.log(`Using fallback price for submission based on garage capacity: $${fallbackPrice}`);
        finalPrice = fallbackPrice;
        
        // Preserve this fallback price for consistency
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('preservedTotalPrice', finalPrice.toString());
          sessionStorage.setItem('preservedTotalPriceTimestamp', Date.now().toString());
        }
      }

      if (isNewSubmission) {
        // For new submissions, save whatever data we have so far
        const { data, error } = await createSubmission(formValues, finalPrice, discountCode, discountPercentage);

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
          console.log('Saved new submission with ID:', data[0].id);
          setSubmissionId(data[0].id);
          // Store submission ID in session storage to persist across page reloads
          sessionStorage.setItem('calculatorSubmissionId', data[0].id);
        }

        toast({
          title: "Success",
          description: "Your information has been saved",
          className: "bg-green-500 text-white border-none",
        });
      } else if (submissionId) {
        // For updates, create update object with only non-undefined values
        const updateData = buildUpdateObject(formValues, finalPrice, discountCode, discountPercentage);
        
        const { error } = await updateSubmission(submissionId, updateData);

        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Updated submission with ID:', submissionId, 'with data:', updateData);
      } else {
        // Try to recover submission ID from session storage
        const storedId = sessionStorage.getItem('calculatorSubmissionId');
        if (storedId) {
          console.log('Recovered submission ID from session storage:', storedId);
          setSubmissionId(storedId);
          // Recursively call this function again now that we have the ID
          return await saveSubmission(formValues, false, finalPrice, discountCode, discountPercentage);
        } else {
          console.error('No submission ID found and could not recover from session storage');
          toast({
            title: "Error",
            description: "Something went wrong with your session. Please refresh the page and try again.",
            variant: "destructive",
          });
          return false;
        }
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

  // Helper function to determine a fallback price based on garage capacity
  const determineFallbackPrice = (garageCapacity?: number): number => {
    if (!garageCapacity || garageCapacity <= 0) {
      return 2000; // Default fallback price
    }
    
    // Price tiers based on garage capacity
    const priceTiers: Record<number, number> = {
      1: 1000,
      2: 2200,
      3: 3500,
      4: 5000,
      5: 6500
    };
    
    return priceTiers[garageCapacity] || 2000;
  };

  const updatePaymentInfo = async (
    preferredInstallationDate?: Date,
    checkoutSessionId?: string,
    paymentStatus?: string
  ) => {
    // Try to use stored ID if not available in state
    const idToUse = submissionId || sessionStorage.getItem('calculatorSubmissionId');
    
    if (!idToUse) {
      console.error('No submission ID found for payment update');
      toast({
        title: "Error",
        description: "Session information is missing. Please refresh the page and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      console.log('Updating payment info with:', {
        id: idToUse,
        date: preferredInstallationDate,
        sessionId: checkoutSessionId,
        status: paymentStatus
      });
      
      // Convert Date object to ISO string format before sending to the database
      const formattedDate = preferredInstallationDate 
        ? new Date(preferredInstallationDate.getTime() - (preferredInstallationDate.getTimezoneOffset() * 60000))
            .toISOString().split('T')[0]
        : undefined;
      
      const updateData: Record<string, any> = {};
      
      if (formattedDate) updateData.preferred_installation_date = formattedDate;
      if (checkoutSessionId) updateData.checkout_session_id = checkoutSessionId;
      if (paymentStatus) updateData.payment_status = paymentStatus;
      
      // Ensure we have a valid price when updating payment info
      const preservedPrice = getPreservedCalculationData();
      if (preservedPrice && preservedPrice > 0) {
        updateData.total_price = preservedPrice;
        console.log('Including preserved price in payment update:', preservedPrice);
      }
      
      const { error } = await updatePaymentInfoDb(idToUse, updateData);

      if (error) {
        console.error('Payment info update error:', error);
        throw error;
      }
      
      console.log('Successfully updated payment info for submission:', idToUse);
      return true;
    } catch (error) {
      console.error('Error updating payment information:', error);
      toast({
        title: "Error",
        description: "Failed to update payment information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submissionId, saveSubmission, updatePaymentInfo };
};
