
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { PaymentStep } from "@/components/calculator/PaymentStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useToast } from "@/components/ui/use-toast";

export default function PaymentPage() {
  const {
    step,
    totalCost,
    formValues,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Payment Step',
        page_path: '/calculator/payment'
      });
    }
    
    // Check if we have all the required data
    if (!formValues.name || !formValues.email || !formValues.phone) {
      toast({
        title: "Missing information",
        description: "Please complete all previous steps before proceeding to payment",
        variant: "destructive",
      });
      handlePrevStep();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Options | Garage Floor Coating Calculator</title>
        <meta name="description" content="Review your garage floor coating estimate and choose a payment option." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={() => {}}
        onPrev={handlePrevStep}
        isNextDisabled={false}
        options={{ garageFinish: formValues.garageFinish }}
      >
        <PaymentStep 
          formData={formValues} 
          totalCost={totalCost} 
          onBack={handlePrevStep}
        />
      </CalcPageLayout>
    </>
  );
}
