
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "@/components/calculator/types";
import { createSubmission, updateSubmission, buildUpdateObject } from "./utils/submission-db";
import { usePaymentSubmission } from "./use-payment-submission";
import { determineFallbackPrice } from "./utils/pricing-utils";
import { validateZipCode, validateRequiredFields } from "./utils/validation-utils";

export const useSubmission = () => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();
  const { updatePaymentInfo } = usePaymentSubmission(submissionId);

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
      if (isNewSubmission && !validateZipCode(formValues.location)) {
        toast({
          title: "Error",
          description: "Please enter a valid 5-digit ZIP code before continuing",
          variant: "destructive",
        });
        return false;
      }

      // Add price validation and fallback logic
      let finalPrice = totalPrice;
      
      // Final safeguard: use fallback price if still invalid
      if (formValues.garageCapacity && (!finalPrice || finalPrice <= 0)) {
        finalPrice = determineFallbackPrice(formValues.garageCapacity);
        console.log(`Using fallback price for submission based on garage capacity: $${finalPrice}`);
        
        // Preserve this fallback price for consistency
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('preservedTotalPrice', finalPrice.toString());
          sessionStorage.setItem('preservedTotalPriceTimestamp', Date.now().toString());
        }
      }

      if (isNewSubmission) {
        const { data, error } = await createSubmission(formValues, finalPrice, discountCode, discountPercentage);

        if (error) {
          console.error('Database error:', error);
          toast({
            title: "Error",
            description: "Failed to save your information",
            variant: "destructive",
          });
          return false;
        }

        if (data && data[0]) {
          console.log('Saved new submission with ID:', data[0].id);
          setSubmissionId(data[0].id);
          sessionStorage.setItem('calculatorSubmissionId', data[0].id);
        }

        toast({
          title: "Success",
          description: "Your information has been saved",
          className: "bg-green-500 text-white border-none",
        });
      } else if (submissionId) {
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

  return { submissionId, saveSubmission, updatePaymentInfo };
};
