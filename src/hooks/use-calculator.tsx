
import { useFormState } from "./calculator/use-form-state";
import { useCostCalculation } from "./calculator/use-cost-calculation";
import { useSubmission } from "./calculator/use-submission";
import { CalculatorInputs } from "@/components/calculator/types";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
  
  // Handle navigation between steps
  const handleNextStep = async (formData: Partial<CalculatorInputs>) => {
    const nextStepUrl = getStepUrl(step + 1);
    const success = await saveSubmission(formData, step === 1, totalCost);
    if (success) {
      navigate(nextStepUrl);
    }
  };
  
  const handlePrevStep = async (formData: Partial<CalculatorInputs>) => {
    if (step > 1) {
      const prevStepUrl = getStepUrl(step - 1);
      await saveSubmission(formData, false, totalCost);
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
    handleNextStep: () => handleNextStep(formValues),
    handlePrevStep: () => handlePrevStep(formValues),
    getStepUrl
  };
};
