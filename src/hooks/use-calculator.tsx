
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
    currentCondition
  } = useFormState();

  const { submissionId, saveSubmission } = useSubmission();
  const { step, handleNextStep, handlePrevStep } = useStepNavigation(saveSubmission);
  const { totalCost } = useCostCalculation(formValues, step);

  // Debug the current form values, step, and totalCost
  useEffect(() => {
    console.log('Current step:', step);
    console.log('Current form values:', formValues);
    console.log('Current totalCost:', totalCost);
  }, [formValues, totalCost, step]);

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
    handleNextStep: () => handleNextStep(formValues as CalculatorInputs),
    handlePrevStep: () => handlePrevStep(formValues as CalculatorInputs),
  };
};
