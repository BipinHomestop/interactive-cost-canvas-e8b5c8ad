import { useFormState } from "./calculator/use-form-state";
import { useCostCalculation } from "./calculator/use-cost-calculation";
import { useSubmission } from "./calculator/use-submission";
import { CalculatorInputs } from "@/components/calculator/types";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const { submissionId, saveSubmission } = useSubmission();
  
  const getCurrentStep = (): number => {
    const pathMap: Record<string, number> = {
      "/": 1,
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
    
    return pathMap[location.pathname] || 1;
  };
  
  const step = getCurrentStep();
  
  const handleNextStep = async () => {
    const nextStepUrl = getStepUrl(step + 1);
    console.log('Moving to next step with form values:', formValues);
    const success = await saveSubmission(formValues, step === 1, totalCost);
    if (success) {
      navigate(nextStepUrl);
    }
  };
  
  const handlePrevStep = async () => {
    if (step > 1) {
      const prevStepUrl = getStepUrl(step - 1);
      console.log('Moving to previous step with form values:', formValues);
      await saveSubmission(formValues, false, totalCost);
      navigate(prevStepUrl);
    }
  };
  
  const getStepUrl = (stepNumber: number): string => {
    const stepUrls: Record<number, string> = {
      1: "/",
      2: "/calculator/contact",
      3: "/calculator/garage-capacity",
      4: "/calculator/garage-finish",
      5: "/calculator/stem-walls",
      6: "/calculator/house-steps",
      7: "/calculator/additional-footage",
      8: "/calculator/current-condition",
      9: "/calculator/payment"
    };
    
    return stepUrls[stepNumber] || "/";
  };
  
  const { totalCost } = useCostCalculation(formValues, step);

  useEffect(() => {
    console.log('Current step:', step);
    console.log('Current form values:', formValues);
    console.log('Current totalCost:', totalCost);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'calculator_step', {
        'step_number': step,
        'step_name': getStepName(step),
        'current_total': totalCost
      });
    }
  }, [formValues, totalCost, step]);
  
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

  const getStepOptions = (): Partial<CalculatorInputs> => {
    const options: Partial<CalculatorInputs> = {};
    
    if (formValues.garageFinish) {
      options.garageFinish = formValues.garageFinish;
      console.log('Including garage finish in options:', formValues.garageFinish);
    }
    
    switch (step) {
      case 5:
        if (formValues.needStemWalls) options.needStemWalls = formValues.needStemWalls;
        if (formValues.stemWallType) options.stemWallType = formValues.stemWallType;
        console.log('Step 5 options:', options);
        break;
      case 6:
        if (formValues.needSteps) options.needSteps = formValues.needSteps;
        break;
      case 7:
        if (formValues.needExtraFootage) options.needExtraFootage = formValues.needExtraFootage;
        if (formValues.extraFootage) options.extraFootage = formValues.extraFootage;
        break;
      case 8:
        if (formValues.currentCondition) options.currentCondition = formValues.currentCondition;
        break;
    }
    
    console.log('getStepOptions returning:', options);
    return options;
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
    control,
    handleNextStep,
    handlePrevStep,
    getStepUrl,
    getStepOptions
  };
};
