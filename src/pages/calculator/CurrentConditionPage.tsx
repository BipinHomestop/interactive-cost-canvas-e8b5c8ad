
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { CurrentConditionStep } from "@/components/calculator/CurrentConditionStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import * as imageUtils from "@/components/calculator/hooks/utils/imageUtils";

export default function CurrentConditionPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    currentCondition,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = async () => {
    if (!formValues.currentCondition) {
      toast({
        title: "Error",
        description: "Please select the current condition of your garage floor",
        variant: "destructive",
      });
      return;
    }
    
    // Store the condition image before proceeding
    try {
      await imageUtils.handleConditionImage(formValues.currentCondition);
      console.log('Stored condition image for', formValues.currentCondition);
    } catch (error) {
      console.error('Error storing condition image:', error);
    }
    
    handleNextStep();
  };
  
  const handleConditionChange = (value: string) => {
    setValue("currentCondition", value as "original" | "existing");
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Current Condition Step',
        page_path: '/calculator/current-condition'
      });
    }
  }, []);

  // Get options with the current step's required values
  const options = getStepOptions();

  return (
    <>
      <Helmet>
        <title>Current Condition | Garage Floor Coating Calculator</title>
        <meta name="description" content="Indicate the current condition of your garage floor for an accurate coating estimate." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={!formValues.currentCondition}
        isLastStep={true}
        options={options}
      >
        <CurrentConditionStep 
          condition={currentCondition}
          onConditionChange={handleConditionChange}
        />
      </CalcPageLayout>
    </>
  );
}
