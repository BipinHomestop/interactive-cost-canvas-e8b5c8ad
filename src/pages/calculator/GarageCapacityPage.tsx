
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { GarageCapacityStep } from "@/components/calculator/GarageCapacityStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function GarageCapacityPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    if (!formValues.garageCapacity) {
      toast({
        title: "Error",
        description: "Please select your garage capacity",
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
        page_title: 'Garage Capacity Step',
        page_path: '/calculator/garage-capacity'
      });
    }
    
    console.log('GarageCapacityPage - Current form values:', formValues);
  }, []);

  return (
    <>
      <Helmet>
        <title>Garage Capacity | Garage Floor Coating Calculator</title>
        <meta name="description" content="Select the number of cars your garage can accommodate to get an accurate cost estimate." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={!formValues.garageCapacity}
        options={{
          garageFinish: formValues.garageFinish
        }}
      >
        <GarageCapacityStep 
          capacity={formValues.garageCapacity} 
          onCapacityChange={([value]) => setValue("garageCapacity", value)} 
        />
      </CalcPageLayout>
    </>
  );
}
