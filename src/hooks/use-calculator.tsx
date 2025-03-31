
import { useFormState } from "./calculator/use-form-state";
import { useCostCalculation } from "./calculator/use-cost-calculation";
import { useSubmission } from "./calculator/use-submission";
import { useStepNavigation } from "./calculator/use-step-navigation";
import { CalculatorInputs } from "@/components/calculator/types";
import { useEffect } from "react";

export const useCalculator = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formValues,
    selectedFinish,
    needStemWalls,
    needSteps,
    needExtraFootage,
    currentCondition,
    setError,
    control
  } = useFormState();

  const { submissionId, saveSubmission } = useSubmission();
  
  const { step, handleNextStep, handlePrevStep } = useStepNavigation(
    (formData: Partial<CalculatorInputs>, isNewSubmission: boolean) => 
      saveSubmission(formData, isNewSubmission, totalCost)
  );
  
  const { totalCost } = useCostCalculation(formValues, step);

  // Debug the current form values, step, and totalCost
  useEffect(() => {
    console.log('Current step:', step);
    console.log('Current form values:', formValues);
    console.log('Current totalCost:', totalCost);
    
    // Track step progression for analytics
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'event': 'calculator_step',
        'step_number': step,
        'step_name': getStepName(step),
        'current_total': totalCost
      });
    }
  }, [formValues, totalCost, step]);
  
  // Helper function to get step name for analytics
  const getStepName = (stepNumber: number): string => {
    const stepNames = {
      1: 'location',
      2: 'contact',
      3: 'garage_capacity',
      4: 'garage_finish',
      5: 'stem_walls',
      6: 'house_steps',
      7: 'additional_footage',
      8: 'current_condition',
      9: 'payment'
    };
    return stepNames[stepNumber as keyof typeof stepNames] || 'unknown';
  };

  return {
    step,
    totalCost,
    register,
    handleSubmit,
    setValue,
    watch,
    formValues,
    selectedFinish,
    needStemWalls,
    needSteps,
    needExtraFootage,
    currentCondition,
    setError,
    handleNextStep: () => handleNextStep(formValues),
    handlePrevStep: () => handlePrevStep(formValues),
  };
};
