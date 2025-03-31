
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { AdditionalFootageStep } from "@/components/calculator/AdditionalFootageStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function AdditionalFootagePage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    needExtraFootage,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  const handleNext = () => {
    if (!formValues.needExtraFootage) {
      toast({
        title: "Error",
        description: "Please select whether you need additional footage",
        variant: "destructive",
      });
      return;
    }
    
    if (formValues.needExtraFootage === "yes" && !formValues.extraFootage) {
      toast({
        title: "Error",
        description: "Please select the additional footage amount",
        variant: "destructive",
      });
      return;
    }
    
    handleNextStep();
  };
  
  // Separate handlers for option changes to prevent automatic navigation
  const handleNeedExtraFootageChange = (value: string) => {
    setValue("needExtraFootage", value as "yes" | "no");
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

  return (
    <>
      <Helmet>
        <title>Additional Square Footage | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if you need additional square footage coated for your garage floor project." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={isNextDisabled}
        options={{
          needExtraFootage: formValues.needExtraFootage,
          extraFootage: formValues.extraFootage
        }}
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
