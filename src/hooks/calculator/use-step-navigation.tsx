
import { useState } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { useToast } from "@/components/ui/use-toast";

export const useStepNavigation = (
  saveSubmission: (formValues: CalculatorInputs, isNewSubmission: boolean) => Promise<boolean>
) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const handleNextStep = async (formValues: CalculatorInputs) => {
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
    } else if (step > 2) {
      const success = await saveSubmission(formValues, false);
      if (!success) return;
    }
    
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const handlePrevStep = async (formValues: CalculatorInputs) => {
    if (step > 2) {
      await saveSubmission(formValues, false);
    }
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return { step, handleNextStep, handlePrevStep };
};
