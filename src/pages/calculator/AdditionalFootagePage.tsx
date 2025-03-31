
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
    formValues,
    setValue,
    needExtraFootage,
    handleNextStep,
    handlePrevStep,
    getStepOptions
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
    
    if (formValues.needExtraFootage === 'yes' && !formValues.extraFootage) {
      toast({
        title: "Error",
        description: "Please select the additional footage amount",
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
        page_title: 'Additional Footage Step',
        page_path: '/calculator/additional-footage'
      });
    }
    
    console.log('AdditionalFootagePage - Current form values:', formValues);
  }, []);

  // Get options with garage finish for image display
  const options = getStepOptions();
  console.log('AdditionalFootagePage - Using options for image display:', options);

  return (
    <>
      <Helmet>
        <title>Additional Footage | Garage Floor Coating Calculator</title>
        <meta name="description" content="Specify if you need additional square footage beyond your garage coated." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={
          !formValues.needExtraFootage || 
          (formValues.needExtraFootage === 'yes' && !formValues.extraFootage)
        }
        options={options}
      >
        <AdditionalFootageStep 
          needExtraFootage={needExtraFootage} 
          extraFootage={formValues.extraFootage} 
          onNeedExtraFootageChange={value => setValue("needExtraFootage", value)} 
          onExtraFootageChange={value => setValue("extraFootage", value)} 
        />
      </CalcPageLayout>
    </>
  );
}
