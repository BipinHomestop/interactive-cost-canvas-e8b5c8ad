
import { useState } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { useToast } from "@/components/ui/use-toast";

export const useStepNavigation = (
  saveSubmission: (formValues: Partial<CalculatorInputs>, isNewSubmission: boolean) => Promise<boolean>
) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Validate phone number function
  const isValidPhoneNumber = (phone: string): boolean => {
    // Clean the input from any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if it has exactly 10 digits for US phone numbers
    return cleanedPhone.length === 10;
  };

  // Validate ZIP code format
  const isValidZipCode = (zipcode: string): boolean => {
    return /^\d{5}$/.test(zipcode);
  };

  const handleNextStep = async (formValues: Partial<CalculatorInputs>) => {
    // For step 1 (location), validate ZIP code
    if (step === 1) {
      if (!formValues.location || !isValidZipCode(formValues.location)) {
        toast({
          title: "Error",
          description: "Please enter a valid 5-digit ZIP code",
          variant: "destructive",
        });
        return;
      }
      
      // The location step component will validate if the ZIP code is in service area
      // We just need to make sure it has the correct format here
    }
    
    // For step 2 (contact info), validate required fields and phone format
    if (step === 2) {
      if (!formValues.name || !formValues.phone || !formValues.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Validate phone number format
      if (formValues.phone && !isValidPhoneNumber(formValues.phone)) {
        toast({
          title: "Error",
          description: "Please enter a valid 10-digit phone number",
          variant: "destructive",
        });
        return;
      }

      const success = await saveSubmission(formValues, true);
      if (!success) return;
    } else {
      // For any other step, just save what we have without validation
      // This captures incomplete data
      await saveSubmission(formValues, step <= 2);
    }
    
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const handlePrevStep = async (formValues: Partial<CalculatorInputs>) => {
    // Always save current data when going back
    if (step > 1) {
      await saveSubmission(formValues, step <= 2);
    }
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return { step, handleNextStep, handlePrevStep };
};
