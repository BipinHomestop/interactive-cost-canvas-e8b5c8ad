
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { HouseStepsStep } from "@/components/calculator/HouseStepsStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function HouseStepsPage() {
  const {
    step,
    totalCost,
    formValues,
    setValue,
    needSteps,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    if (!formValues.needSteps) {
      toast({
        title: "Error",
        description: "Please select whether you need steps",
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
        page_title: 'House Steps Step',
        page_path: '/calculator/house-steps'
      });
    }
    
    console.log('HouseStepsPage - Current form values:', formValues);
  }, []);

  // Get options with garage finish for image display
  const options = getStepOptions();
  console.log('HouseStepsPage - Using options for image display:', options);

  return (
    <>
      <Helmet>
        <title>House Steps | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if your garage has steps leading to the house that need coating." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={!formValues.needSteps}
        options={options}
      >
        <HouseStepsStep 
          needSteps={needSteps} 
          onNeedStepsChange={value => setValue("needSteps", value as "yes" | "no")} 
        />
      </CalcPageLayout>
    </>
  );
}
