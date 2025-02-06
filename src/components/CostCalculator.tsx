import { useForm } from "react-hook-form";
import { LocationStep } from "./calculator/LocationStep";
import { ContactStep } from "./calculator/ContactStep";
import { GarageCapacityStep } from "./calculator/GarageCapacityStep";
import { GarageFinishStep } from "./calculator/GarageFinishStep";
import { StemWallsStep } from "./calculator/StemWallsStep";
import { HouseStepsStep } from "./calculator/HouseStepsStep";
import { AdditionalFootageStep } from "./calculator/AdditionalFootageStep";
import { CurrentConditionStep } from "./calculator/CurrentConditionStep";
import { PaymentStep } from "./calculator/PaymentStep";
import { ImageDisplay } from "./calculator/ImageDisplay";
import { FormNavigation } from "./calculator/FormNavigation";
import { FAQSection } from "./calculator/FAQSection";
import { useCalculator } from "@/hooks/use-calculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { StepImages } from "./calculator/types";

export function CostCalculator() {
  const isMobile = useIsMobile();
  const {
    step,
    totalCost,
    register,
    handleSubmit,
    setValue,
    watch,
    formValues,
    selectedFinish,
    needStemWalls,
    needSteps,
    needExtraFootage,
    currentCondition,
    handleNextStep,
    handlePrevStep,
  } = useCalculator();

  const getStepImage = () => {
    if (step === 1) return '/lovable-uploads/62e2af60-d299-4d29-8ca5-c9c80043fb8a.png';
    if (step === 2) return '/lovable-uploads/9705bd48-08d2-400c-b01d-5740be6ec27c.png';
    if (step === 3) return '/lovable-uploads/093c6d4b-f6c3-44e7-ab98-c4ce9efbf48d.png';
    if (step === 8) {
      return formValues.currentCondition === 'original' 
        ? '/lovable-uploads/43dc3634-2c4b-4290-b0db-7f703160ab5c.png'
        : '/lovable-uploads/7bd831b9-3219-44b8-8aac-aaa4681fa3f3.png';
    }
    return '/lovable-uploads/093c6d4b-f6c3-44e7-ab98-c4ce9efbf48d.png'; // Default image for other steps
  };

  const isNextDisabled = () => {
    switch (step) {
      case 1:
        return !formValues.location;
      case 2:
        return !formValues.name || !formValues.phone || !formValues.email;
      case 3:
        return !formValues.garageCapacity;
      case 4:
        return !formValues.garageFinish;
      case 5:
        return !formValues.needStemWalls || (formValues.needStemWalls === "yes" && !formValues.stemWallType);
      case 6:
        return !formValues.needSteps;
      case 7:
        return !formValues.needExtraFootage || (formValues.needExtraFootage === "yes" && !formValues.extraFootage);
      case 8:
        return !formValues.currentCondition;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <LocationStep
            onLocationChange={(value) => setValue("location", value)}
          />
        );
      case 2:
        return <ContactStep register={register} />;
      case 3:
        return (
          <GarageCapacityStep
            capacity={formValues.garageCapacity}
            onCapacityChange={([value]) => setValue("garageCapacity", value)}
          />
        );
      case 4:
        return (
          <GarageFinishStep
            selectedFinish={selectedFinish}
            onFinishChange={(value) => setValue("garageFinish", value as "snowfall" | "granite" | "slate")}
          />
        );
      case 5:
        return (
          <StemWallsStep
            needStemWalls={needStemWalls}
            stemWallType={formValues.stemWallType}
            onStemWallsChange={(value) => setValue("needStemWalls", value as "yes" | "no")}
            onStemWallTypeChange={(value) => setValue("stemWallType", value as "standard" | "large")}
          />
        );
      case 6:
        return (
          <HouseStepsStep
            needSteps={needSteps}
            onNeedStepsChange={(value) => setValue("needSteps", value as "yes" | "no")}
          />
        );
      case 7:
        return (
          <AdditionalFootageStep
            needExtraFootage={needExtraFootage}
            extraFootage={formValues.extraFootage}
            onNeedExtraFootageChange={(value) => setValue("needExtraFootage", value as "yes" | "no")}
            onExtraFootageChange={(value) => setValue("extraFootage", value as "up-to-50" | "51-100" | "101-150" | "151-200")}
          />
        );
      case 8:
        return (
          <CurrentConditionStep
            condition={currentCondition}
            onConditionChange={(value) => setValue("currentCondition", value as "original" | "existing")}
          />
        );
      case 9:
        return <PaymentStep onBack={handlePrevStep} formData={formValues} totalCost={totalCost} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full px-4 lg:px-8">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-stretch max-w-[1400px] mx-auto gap-3`}>
        <div className={`${isMobile ? 'w-full mb-6' : 'w-[35%]'}`}>
          <ImageDisplay
            imageSrc={getStepImage()}
            totalCost={totalCost}
            step={step}
            options={{
              garageFinish: formValues.garageFinish,
              needStemWalls: formValues.needStemWalls,
              stemWallType: formValues.stemWallType,
              needSteps: formValues.needSteps
            }}
          />
        </div>
        
        <div className={`${isMobile ? 'w-full' : 'w-[35%]'} bg-white rounded-xl shadow-lg p-6 ${isMobile ? 'h-auto' : 'h-[600px]'} relative ${step === 9 ? 'overflow-y-auto' : ''}`}>
          <form onSubmit={handleSubmit(() => {})} className="space-y-6 h-full">
            <div className="flex-grow">
              {renderStep()}
            </div>
            {step < 9 && (
              <div className="absolute bottom-6 left-6 right-6">
                <FormNavigation
                  step={step}
                  onNext={handleNextStep}
                  onPrev={handlePrevStep}
                  isLastStep={step === 8}
                  isNextDisabled={isNextDisabled()}
                />
              </div>
            )}
          </form>
        </div>

        <div className={`${isMobile ? 'w-full mt-6' : 'w-[30%]'} bg-white rounded-xl shadow-lg p-6 ${isMobile ? 'h-auto' : 'h-[600px]'} overflow-y-auto`}>
          {(step >= 3 || step <= 2 || step === 9) && (
            <FAQSection step={step} />
          )}
        </div>
      </div>
    </div>
  );
}
