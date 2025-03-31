
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { AdditionalFootageStep } from "@/components/calculator/AdditionalFootageStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";
import * as imageUtils from "@/components/calculator/hooks/utils/imageUtils";

export default function AdditionalFootagePage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    needExtraFootage,
    handleNextStep,
    handlePrevStep,
    getStepOptions
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = async () => {
    // Validation checks
    if (!formValues.needExtraFootage) {
      toast({
        title: "Error",
        description: "Please select whether you need additional footage",
        variant: "destructive",
      });
      return;
    }
    
    // If they need extra footage, make sure they've selected how much
    if (formValues.needExtraFootage === "yes" && !formValues.extraFootage) {
      toast({
        title: "Error",
        description: "Please select how much extra footage you need",
        variant: "destructive",
      });
      return;
    }
    
    // Store the extra footage image before proceeding
    try {
      await imageUtils.handleExtraFootageImage(formValues);
      console.log('Stored extra footage image for', formValues.needExtraFootage, formValues.extraFootage);
    } catch (error) {
      console.error('Error storing extra footage image:', error);
    }
    
    handleNextStep();
  };
  
  const handleNeedExtraFootageChange = (value: string) => {
    setValue("needExtraFootage", value as "yes" | "no");
    // Reset extra footage if user selects no
    if (value === "no") {
      setValue("extraFootage", undefined);
    }
  };
  
  const handleExtraFootageChange = (value: string) => {
    setValue("extraFootage", value as "up-to-50" | "51-100" | "101-150" | "151-200");
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Additional Footage Step',
        page_path: '/calculator/additional-footage'
      });
    }
  }, []);

  const isNextDisabled = !formValues.needExtraFootage || (formValues.needExtraFootage === "yes" && !formValues.extraFootage);

  // Get options with the current step's required values
  const options = getStepOptions();

  return (
    <>
      <Helmet>
        <title>Additional Footage | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if you need additional square footage beyond your garage floor." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={isNextDisabled}
        options={options}
      >
        <AdditionalFootageStep 
          needExtraFootage={needExtraFootage} 
          extraFootage={formValues.extraFootage}
          onNeedExtraFootageChange={handleNeedExtraFootageChange}
          onExtraFootageChange={handleExtraFootageChange}
        />
      </CalcPageLayout>
    </>
  );
}
