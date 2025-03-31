
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { StemWallsStep } from "@/components/calculator/StemWallsStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import * as db from "@/components/calculator/hooks/utils/databaseQueries";
import * as imageUtils from "@/components/calculator/hooks/utils/imageUtils";

export default function StemWallsPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    needStemWalls,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = async () => {
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
    
    // Store the stem wall image before proceeding
    try {
      if (formValues.garageFinish) {
        const finishCollection = await db.getFinishCollectionImage(formValues.garageFinish);
        if (finishCollection) {
          await imageUtils.handleStemWallImage(finishCollection, formValues);
          console.log('Stored stem wall image for', formValues.garageFinish, formValues.needStemWalls, formValues.stemWallType);
        }
      }
    } catch (error) {
      console.error('Error storing stem wall image:', error);
    }
    
    // If all validations pass, proceed to next step
    handleNextStep();
  };
  
  // Handlers for stem wall selections
  const handleStemWallsChange = (value: string) => {
    setValue("needStemWalls", value as "yes" | "no");
    // Reset stem wall type if user selects no
    if (value === "no") {
      setValue("stemWallType", undefined);
    }
  };
  
  const handleStemWallTypeChange = (value: string) => {
    setValue("stemWallType", value as "standard" | "large");
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Stem Walls Step',
        page_path: '/calculator/stem-walls'
      });
    }
    
    // Log current form values
    console.log('StemWallsPage - Current options:', getStepOptions());
  }, []);

  const isNextDisabled = !formValues.needStemWalls || (formValues.needStemWalls === "yes" && !formValues.stemWallType);

  // Get options with the current step's required values
  const options = getStepOptions();

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
        options={options}
      >
        <StemWallsStep 
          needStemWalls={needStemWalls} 
          stemWallType={formValues.stemWallType}
          onStemWallsChange={handleStemWallsChange}
          onStemWallTypeChange={handleStemWallTypeChange}
        />
      </CalcPageLayout>
    </>
  );
}
