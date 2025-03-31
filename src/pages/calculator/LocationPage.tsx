
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { LocationStep } from "@/components/calculator/LocationStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function LocationPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const { toast } = useToast();
  
  // Validate ZIP code function
  const isValidZipCode = (zipcode: string | undefined): boolean => {
    if (!zipcode) return false;
    return /^\d{5}$/.test(zipcode); // Must be exactly 5 digits
  };

  const handleNext = () => {
    if (!formValues.location || !isValidZipCode(formValues.location)) {
      toast({
        title: "Error",
        description: "Please enter a valid 5-digit ZIP code",
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
        page_title: 'Location Step',
        page_path: '/calculator/location'
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Location | Garage Floor Coating Calculator</title>
        <meta name="description" content="Enter your ZIP code to get an accurate cost estimate for your garage floor coating project." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={false}
      >
        <LocationStep onLocationChange={value => setValue("location", value)} />
      </CalcPageLayout>
    </>
  );
}
