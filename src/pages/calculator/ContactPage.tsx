
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { ContactStep } from "@/components/calculator/ContactStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function ContactPage() {
  const {
    step,
    totalCost,
    register,
    watch,
    setError,
    formValues,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  // Validate phone number function
  const isValidPhoneNumber = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\D/g, '');
    return cleanedPhone.length === 10;
  };

  const handleNext = () => {
    if (!formValues.name || !formValues.phone || !formValues.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formValues.phone && !isValidPhoneNumber(formValues.phone)) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
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
        page_title: 'Contact Step',
        page_path: '/calculator/contact'
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Information | Garage Floor Coating Calculator</title>
        <meta name="description" content="Provide your contact details to receive your custom garage floor coating estimate." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={false}
      >
        <ContactStep register={register} watch={watch} setError={setError} />
      </CalcPageLayout>
    </>
  );
}
