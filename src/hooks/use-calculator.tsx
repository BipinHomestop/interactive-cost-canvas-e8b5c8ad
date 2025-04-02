
import { useFormState } from "./calculator/use-form-state";
import { useCostCalculation } from "./calculator/use-cost-calculation";
import { useSubmission } from "./calculator/use-submission";
import { useStepNavigation } from "./calculator/use-step-navigation";
import { CalculatorInputs } from "@/components/calculator/types";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    console.log('Current submissionId:', submissionId || sessionStorage.getItem('calculatorSubmissionId') || 'none');
    
    // Track step progression for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'calculator_step', {
        'step_number': step,
        'step_name': getStepName(step),
        'current_total': totalCost,
        'has_submission_id': !!submissionId || !!sessionStorage.getItem('calculatorSubmissionId')
      });
      
      // Track event in our own database
      logCalculatorStep(step, getStepName(step), totalCost);
    }
  }, [formValues, totalCost, step, submissionId]);
  
  // Helper function to log calculator steps to our database
  const logCalculatorStep = async (stepNumber: number, stepName: string, currentTotal: number) => {
    try {
      // Create a basic IP hash for user identification
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (!ipResponse.ok) return;
      
      const ipData = await ipResponse.json();
      const encoder = new TextEncoder();
      const data = encoder.encode(ipData.ip + 'garagefloorcoating-salt');
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const ipHash = Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Insert into analytics_location_visits
      const { error, data: insertData } = await supabase
        .from('analytics_location_visits')
        .insert({
          city: ipData.city || 'Unknown',
          zipcode: ipData.postal || 'Unknown',
          region: ipData.region || 'Unknown',
          country: ipData.country_name || 'Unknown',
          ip_hash: ipHash,
          visit_date: new Date().toISOString().split('T')[0],
          visit_time: new Date().toTimeString().split(' ')[0],
          page_visited: `calculator-step-${stepNumber}-${stepName}`,
          time_range: '30d' // Default time range
        })
        .select();
      
      console.log(`Step ${stepNumber} (${stepName}) logged to analytics`, insertData);
    } catch (error) {
      console.error('Error logging calculator step:', error);
    }
  };
  
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
