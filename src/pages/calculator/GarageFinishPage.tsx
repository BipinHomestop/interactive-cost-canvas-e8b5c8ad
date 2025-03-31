
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { GarageFinishStep } from "@/components/calculator/GarageFinishStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import * as imageUtils from "@/components/calculator/hooks/utils/imageUtils";

export default function GarageFinishPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    selectedFinish,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = async () => {
    if (!formValues.garageFinish) {
      toast({
        title: "Error",
        description: "Please select a garage finish type",
        variant: "destructive",
      });
      return;
    }
    
    // Store the garage finish image before proceeding
    try {
      await imageUtils.storeGarageFinishImage(formValues.garageFinish);
      console.log('Stored garage finish image for', formValues.garageFinish);
    } catch (error) {
      console.error('Error storing garage finish image:', error);
    }
    
    handleNextStep();
  };
  
  // Use a separate handler for finish changes to prevent automatic navigation
  const handleFinishChange = (value: string) => {
    setValue("garageFinish", value);
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Garage Finish Step',
        page_path: '/calculator/garage-finish'
      });
    }
    
    // Preselect the first finish option if none is selected
    if (!formValues.garageFinish) {
      // We'll use "carbon" as it's the first in the GARAGE_FINISHES array
      setValue("garageFinish", "carbon");
    }
  }, []);

  // Get options with the current step's required values
  const options = getStepOptions();

  return (
    <>
      <Helmet>
        <title>Garage Finish | Garage Floor Coating Calculator</title>
        <meta name="description" content="Choose your preferred garage floor finish type for your project estimate." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={!formValues.garageFinish}
        options={options}
      >
        <GarageFinishStep 
          selectedFinish={selectedFinish} 
          onFinishChange={handleFinishChange} 
        />
      </CalcPageLayout>
    </>
  );
}
