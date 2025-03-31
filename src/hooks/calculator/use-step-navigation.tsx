import { useState, useEffect } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";

export const useStepNavigation = (
  saveSubmission: (formValues: Partial<CalculatorInputs>, isNewSubmission: boolean) => Promise<boolean>
) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { stepNumber } = useParams<{ stepNumber: string }>();
  
  // Initialize step from URL if provided, otherwise default to 1
  const [step, setStep] = useState(() => {
    const urlStep = stepNumber ? parseInt(stepNumber, 10) : 1;
    return !isNaN(urlStep) && urlStep >= 1 && urlStep <= 9 ? urlStep : 1;
  });

  // Keep URL in sync with step state
  useEffect(() => {
    // Only update URL if it doesn't match current step
    if (stepNumber !== step.toString() && step !== 1) {
      navigate(`/step/${step}`, { replace: true });
    } else if (!stepNumber && step === 1) {
      // Keep root URL for step 1
      navigate('/', { replace: true });
    }
  }, [step, stepNumber, navigate]);

  // Validate phone number function
  const isValidPhoneNumber = (phone: string): boolean => {
    // Clean the input from any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if it has exactly 10 digits for US phone numbers
    return cleanedPhone.length === 10;
  };

  // Validate ZIP code function
  const isValidZipCode = (zipcode: string | undefined): boolean => {
    if (!zipcode) return false;
    return /^\d{5}$/.test(zipcode); // Must be exactly 5 digits
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
      
      // Attempt to save with the valid ZIP code
      const success = await saveSubmission(formValues, true);
      if (!success) return;
    }
    // For step 2 (contact info), validate required fields and phone format
    else if (step === 2) {
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

      const success = await saveSubmission(formValues, false);
      if (!success) return;
    } else {
      // For any other step, just save what we have without validation
      // This captures incomplete data
      await saveSubmission(formValues, false);
    }
    
    const nextStep = Math.min(step + 1, 9);
    setStep(nextStep);
    
    // Update URL for step tracking
    if (nextStep === 1) {
      navigate('/', { replace: true });
    } else {
      navigate(`/step/${nextStep}`, { replace: true });
    }
  };

  const handlePrevStep = async (formValues: Partial<CalculatorInputs>) => {
    // Always save current data when going back
    if (step > 1) {
      await saveSubmission(formValues, false);
    }
    
    const prevStep = Math.max(step - 1, 1);
    setStep(prevStep);
    
    // Update URL for step tracking
    if (prevStep === 1) {
      navigate('/', { replace: true });
    } else {
      navigate(`/step/${prevStep}`, { replace: true });
    }
  };

  return { step, handleNextStep, handlePrevStep };
};
