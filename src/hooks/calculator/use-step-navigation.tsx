
import { useNavigate } from "react-router-dom";
import { CalculatorInputs } from "@/components/calculator/types";
import { useToast } from "@/components/ui/use-toast";

export const useStepNavigation = (
  saveSubmission: (formValues: Partial<CalculatorInputs>, isNewSubmission: boolean, totalCost?: number) => Promise<boolean>
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Helper function to get URL for a step
  const getStepUrl = (stepNumber: number): string => {
    const stepUrls: Record<number, string> = {
      1: "/calculator/location",
      2: "/calculator/contact",
      3: "/calculator/garage-capacity",
      4: "/calculator/garage-finish",
      5: "/calculator/stem-walls",
      6: "/calculator/house-steps",
      7: "/calculator/additional-footage",
      8: "/calculator/current-condition",
      9: "/calculator/payment"
    };
    
    return stepUrls[stepNumber] || "/calculator/location";
  };

  // Function to get current step from URL
  const getStepFromUrl = (url: string): number => {
    const pathMap: Record<string, number> = {
      "/calculator/location": 1,
      "/calculator/contact": 2,
      "/calculator/garage-capacity": 3,
      "/calculator/garage-finish": 4,
      "/calculator/stem-walls": 5,
      "/calculator/house-steps": 6,
      "/calculator/additional-footage": 7,
      "/calculator/current-condition": 8,
      "/calculator/payment": 9
    };
    
    return pathMap[url] || 1;
  };

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
    const currentStep = getStepFromUrl(window.location.pathname);
    
    // Handle step-specific validation
    if (currentStep === 1) {
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
    else if (currentStep === 2) {
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
      await saveSubmission(formValues, false);
    }
    
    // Navigate to next step
    const nextStepUrl = getStepUrl(currentStep + 1);
    navigate(nextStepUrl);
  };

  const handlePrevStep = async (formValues: Partial<CalculatorInputs>) => {
    const currentStep = getStepFromUrl(window.location.pathname);
    
    // Always save current data when going back
    if (currentStep > 1) {
      await saveSubmission(formValues, false);
    }
    
    // Navigate to previous step
    const prevStepUrl = getStepUrl(currentStep - 1);
    navigate(prevStepUrl);
  };

  return { 
    step: getStepFromUrl(window.location.pathname), 
    handleNextStep, 
    handlePrevStep 
  };
};
