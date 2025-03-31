
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { HouseStepsStep } from "@/components/calculator/HouseStepsStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import * as db from "@/components/calculator/hooks/utils/databaseQueries";
import * as imageUtils from "@/components/calculator/hooks/utils/imageUtils";

export default function HouseStepsPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    needSteps,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = async () => {
    if (!formValues.needSteps) {
      toast({
        title: "Error",
        description: "Please select whether you need steps",
        variant: "destructive",
      });
      return;
    }
    
    // Store the steps image before proceeding
    try {
      if (formValues.garageFinish) {
        const finishCollection = await db.getFinishCollectionImage(formValues.garageFinish);
        if (finishCollection) {
          await imageUtils.handleStepsImage(finishCollection, formValues.needSteps);
          console.log('Stored steps image for', formValues.garageFinish, formValues.needSteps);
        }
      }
    } catch (error) {
      console.error('Error storing steps image:', error);
    }
    
    handleNextStep();
  };
  
  const handleNeedStepsChange = (value: string) => {
    setValue("needSteps", value as "yes" | "no");
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'House Steps Step',
        page_path: '/calculator/house-steps'
      });
    }
  }, []);

  // Get options with the current step's required values
  const options = getStepOptions();

  return (
    <>
      <Helmet>
        <title>House Steps | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if your garage has steps that need to be coated." />
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
          onNeedStepsChange={handleNeedStepsChange}
        />
      </CalcPageLayout>
    </>
  );
}
