
import { CalcPageLayout } from "@/components/calculator/CalcPageLayout";
import { CurrentConditionStep } from "@/components/calculator/CurrentConditionStep";
import { useCalculator } from "@/hooks/use-calculator";
import { useEffect } from "react";
import { Helmet } from "react-helmet";

export default function CurrentConditionPage() {
  const {
    step,
    totalCost,
    setValue,
    formValues,
    currentCondition,
    handleNextStep,
    handlePrevStep
  } = useCalculator();
  
  const handleNext = () => {
    if (!formValues.currentCondition) {
      return;
    }
    handleNextStep();
  };
  
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Current Condition Step',
        page_path: '/calculator/current-condition'
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Current Condition | Garage Floor Coating Calculator</title>
        <meta name="description" content="Indicate the current condition of your garage floor for an accurate coating estimate." />
      </Helmet>
      <CalcPageLayout
        step={step}
        totalCost={totalCost}
        onNext={handleNext}
        onPrev={handlePrevStep}
        isNextDisabled={!formValues.currentCondition}
        isLastStep={true}
        options={{
          currentCondition: formValues.currentCondition
        }}
      >
        <CurrentConditionStep 
          condition={currentCondition}
          onConditionChange={value => setValue("currentCondition", value as "original" | "existing")}
        />
      </CalcPageLayout>
    </>
  );
}
