
import { useState } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { useToast } from "@/components/ui/use-toast";

export const useStepNavigation = (
  saveSubmission: (formValues: Partial<CalculatorInputs>, isNewSubmission: boolean) => Promise<boolean>
) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleNextStep = async (formValues: Partial<CalculatorInputs>) => {
    // For step 2 (contact info), validate required fields
    if (step === 2) {
      if (!formValues.name || !formValues.phone || !formValues.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
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
