
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
  
  // Determine current step based on URL path
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
  
  // Get the appropriate options for each step for image display
  const getStepOptions = (): Partial<CalculatorInputs> => {
    const baseOptions = {
      garageFinish: formValues.garageFinish,
    };
    
    switch (step) {
      case 5:
        return {
          ...baseOptions,
          needStemWalls: formValues.needStemWalls,
          stemWallType: formValues.stemWallType
        };
      case 6:
        return {
          ...baseOptions,
          needSteps: formValues.needSteps
        };
      case 7:
        return {
          ...baseOptions,
          needExtraFootage: formValues.needExtraFootage,
          extraFootage: formValues.extraFootage
        };
      case 8:
        return {
          ...baseOptions,
          currentCondition: formValues.currentCondition
        };
      case 9:
        return {
          ...baseOptions,
          needStemWalls: formValues.needStemWalls,
          stemWallType: formValues.stemWallType
        };
      default:
        return baseOptions;
    }
  };
  
  // Handle navigation between steps
  const handleNextStep = async () => {
    const nextStepUrl = getStepUrl(step + 1);
    const success = await saveSubmission(formValues, step === 1, totalCost);
    
    if (success) {
      // Log the current form values before navigating
      console.log('Form values before navigating to next step:', formValues);
      navigate(nextStepUrl);
    }
  };
  
  const handlePrevStep = async () => {
    if (step > 1) {
      const prevStepUrl = getStepUrl(step - 1);
      await saveSubmission(formValues, false, totalCost);
      navigate(prevStepUrl);
    }
  };
  
  // Convert step number to URL
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

  // Debug the current form values, step, and totalCost
  useEffect(() => {
    console.log('Current step:', step);
    console.log('Current form values:', formValues);
    console.log('Current totalCost:', totalCost);
    console.log('Current step options:', getStepOptions());
    
    // Track step progression for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'calculator_step', {
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
    control,
    handleNextStep,
    handlePrevStep,
    getStepUrl,
    getStepOptions
  };
};
