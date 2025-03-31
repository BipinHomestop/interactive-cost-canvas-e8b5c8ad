
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { GarageFinishStep } from "@/components/calculator/GarageFinishStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function GarageFinishPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    selectedFinish,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    if (!formValues.garageFinish) {
      toast({
        title: "Error",
        description: "Please select a garage finish type",
        variant: "destructive",
      });
      return;
    }
    handleNextStep();
  };
  
  // Use a separate handler for finish changes to prevent automatic navigation
  const handleFinishChange = (value: string) => {
    console.log('Changing garage finish to:', value);
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
    
    console.log('GarageFinishPage - Current form values:', formValues);
  }, []);

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
        options={{ garageFinish: formValues.garageFinish }}
      >
        <GarageFinishStep 
          selectedFinish={selectedFinish} 
          onFinishChange={handleFinishChange} 
        />
      </CalcPageLayout>
    </>
  );
}
