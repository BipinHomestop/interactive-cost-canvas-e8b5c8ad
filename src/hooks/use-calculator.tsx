
import { useFormState } from "./calculator/use-form-state";
import { useCostCalculation } from "./calculator/use-cost-calculation";
import { useSubmission } from "./calculator/use-submission";
import { useStepNavigation } from "./calculator/use-step-navigation";

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

  const { step, handleNextStep, handlePrevStep } = useStepNavigation(saveSubmission);
  const { totalCost } = useCostCalculation(formValues, step);
  const { submissionId, saveSubmission } = useSubmission();

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
