
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { StemWallsStep } from "@/components/calculator/StemWallsStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function StemWallsPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    needStemWalls,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    // Validation check
    if (!formValues.needStemWalls) {
      toast({
        title: "Error",
        description: "Please select whether you need stem walls",
        variant: "destructive",
      });
      return;
    }
    
    // If user selected "yes" for stem walls, make sure they've selected a type
    if (formValues.needStemWalls === "yes" && !formValues.stemWallType) {
      toast({
        title: "Error",
        description: "Please select the stem wall type",
        variant: "destructive",
      });
      return;
    }
    
    // If all validations pass, proceed to next step
    handleNextStep();
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Stem Walls Step',
        page_path: '/calculator/stem-walls'
      });
    }
    
    // Log the current form values to help with debugging
    console.log('StemWallsPage - Current form values:', formValues);
  }, []);

  const isNextDisabled = !formValues.needStemWalls || (formValues.needStemWalls === "yes" && !formValues.stemWallType);

  return (
    <>
      <Helmet>
        <title>Stem Walls | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if your garage requires stem wall coating and select the stem wall type." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={isNextDisabled}
        options={{
          garageFinish: formValues.garageFinish,
          needStemWalls: formValues.needStemWalls,
          stemWallType: formValues.stemWallType
        }}
      >
        <StemWallsStep 
          needStemWalls={needStemWalls} 
          stemWallType={formValues.stemWallType}
          onStemWallsChange={value => setValue("needStemWalls", value as "yes" | "no")}
          onStemWallTypeChange={value => setValue("stemWallType", value as "standard" | "large")}
        />
      </CalcPageLayout>
    </>
  );
}
