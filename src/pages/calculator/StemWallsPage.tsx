
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
    formValues,
    setValue,
    needStemWalls,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    if (!formValues.needStemWalls) {
      toast({
        title: "Error",
        description: "Please select whether you need stem walls",
        variant: "destructive",
      });
      return;
    }
    
    if (formValues.needStemWalls === 'yes' && !formValues.stemWallType) {
      toast({
        title: "Error",
        description: "Please select a stem wall type",
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
        page_title: 'Stem Walls Step',
        page_path: '/calculator/stem-walls'
      });
    }
    
    console.log('StemWallsPage - Current form values:', formValues);
  }, []);

  // Get options with garage finish for image display
  const options = getStepOptions();
  console.log('StemWallsPage - Using options for image display:', options);

  return (
    <>
      <Helmet>
        <title>Stem Walls | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if your garage needs stem wall coating and the type required." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={
          !formValues.needStemWalls || 
          (formValues.needStemWalls === 'yes' && !formValues.stemWallType)
        }
        options={options}
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
