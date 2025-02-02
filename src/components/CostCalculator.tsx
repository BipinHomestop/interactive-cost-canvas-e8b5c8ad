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
import { StepImages } from "./calculator/types";
import { useCalculator } from "@/hooks/use-calculator";
import { useIsMobile } from "@/hooks/use-mobile";

const STEP_IMAGES: StepImages = {
  1: "/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png",
  2: "/lovable-uploads/a03bc655-a297-49c7-9c75-9f058f06a1f0.png",
  3: "/lovable-uploads/2bb89b6f-c394-4d76-93ee-047d82eb9749.png",
  4: {
    snowfall: "/lovable-uploads/8c5fc18c-04f5-4038-8b7c-26b5ab584d2f.png",
    granite: "/lovable-uploads/1b676e13-3b36-4585-82b2-96f50b9c10c0.png",
    slate: "/lovable-uploads/ce778aca-463e-48c6-a97c-54df92faef72.png",
    modern: "/lovable-uploads/7d5dc9e5-0c4f-4b51-aa9a-0ff2b7d29bf9.png",
    minimal: "/lovable-uploads/8b955fc5-c99f-4bff-87c9-f8a0b2e32bd2.png",
    glass: "/lovable-uploads/4c24b8ad-5c50-4280-8905-dd9a24dbbcbc.png",
    classic: "/lovable-uploads/92d12e0d-490e-43c8-955b-c49e5a453d04.png",
    premium: "/lovable-uploads/c18b700b-4c7b-4cac-83af-1a93338d0af3.png",
    deluxe: "/lovable-uploads/aae22676-da29-4df0-8e61-9ffe09a999b5.png"
  },
  5: {
    no: "/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png",
    yes: "/lovable-uploads/a03bc655-a297-49c7-9c75-9f058f06a1f0.png",
    standard: "/lovable-uploads/2bb89b6f-c394-4d76-93ee-047d82eb9749.png",
    large: "/lovable-uploads/227500dc-42d6-4f5f-a573-d2aa8a8b5d11.png"
  },
  6: "/lovable-uploads/72033eb4-1949-420d-b7fe-c85dfeb3655c.png",
  7: "/lovable-uploads/df962712-ee4f-4d54-931c-000bf94d6296.png",
  8: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png",
  9: "/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png"
};

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
    const image = STEP_IMAGES[step as keyof typeof STEP_IMAGES];
    if (typeof image === 'string') return image;
    
    if (step === 4 && 'snowfall' in image) {
      return image[selectedFinish];
    }
    
    if (step === 5 && 'no' in image) {
      if (needStemWalls === 'no') return image.no;
      if (needStemWalls === 'yes') {
        if (formValues.stemWallType) {
          return image[formValues.stemWallType];
        }
        return image.yes;
      }
      return image.no;
    }
    
    return '';
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
        <div className={`${isMobile ? 'w-full mb-6' : 'w-[30%]'}`}>
          <ImageDisplay
            imageSrc={getStepImage()}
            totalCost={totalCost}
            step={step}
          />
        </div>
        
        <div className={`${isMobile ? 'w-full' : 'w-[40%]'} bg-white rounded-xl shadow-lg p-6 ${isMobile ? 'h-auto' : 'min-h-[600px]'} relative`}>
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

        <div className={`${isMobile ? 'w-full mt-6' : 'w-[30%]'} bg-white rounded-xl shadow-lg p-6 ${isMobile ? 'h-auto' : 'min-h-[600px]'} overflow-y-auto`}>
          {(step >= 3 || step <= 2) && (
            <FAQSection step={step} />
          )}
        </div>
      </div>
    </div>
  );
}