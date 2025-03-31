
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { CurrentConditionStep } from "@/components/calculator/CurrentConditionStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function CurrentConditionPage() {
  const {
    step,
    totalCost,
    formValues,
    setValue,
    currentCondition,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    if (!formValues.currentCondition) {
      toast({
        title: "Error",
        description: "Please select the current condition of your garage floor",
        variant: "destructive",
      });
      return;
    }
    
    handleNextStep();
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Current Condition Step',
        page_path: '/calculator/current-condition'
      });
    }
    
    console.log('CurrentConditionPage - Current form values:', formValues);
  }, []);

  // Get options with garage finish for image display
  const options = getStepOptions();
  console.log('CurrentConditionPage - Using options for image display:', options);

  return (
    <>
      <Helmet>
        <title>Current Condition | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify the current condition of your garage floor for an accurate estimate." />
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
          onConditionChange={value => setValue("currentCondition", value)} 
        />
      </CalcPageLayout>
    </>
  );
}
