
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { HouseStepsStep } from "@/components/calculator/HouseStepsStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function HouseStepsPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    needSteps,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const handleNext = () => {
    if (!formValues.needSteps) {
      return;
    }
    handleNextStep();
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'House Steps Step',
        page_path: '/calculator/house-steps'
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>House Steps | Garage Floor Coating Calculator</title>
        <meta name="description" content="Indicate if you need steps from your house to the garage for your flooring project." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={!formValues.needSteps}
        options={{
          garageFinish: formValues.garageFinish,
          needSteps: formValues.needSteps
        }}
      >
        <HouseStepsStep 
          needSteps={needSteps}
          onNeedStepsChange={value => setValue("needSteps", value as "yes" | "no")}
        />
      </CalcPageLayout>
    </>
  );
}
