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
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function CostCalculator() {
  const isMobile = useIsMobile();
  const [showFAQ, setShowFAQ] = useState(false);
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
    handlePrevStep
  } = useCalculator();

  const getStepOptions = () => {
    switch (step) {
      case 4:
        return {
          garageFinish: formValues.garageFinish
        };
      case 5:
        return {
          garageFinish: formValues.garageFinish,
          needStemWalls: formValues.needStemWalls,
          stemWallType: formValues.stemWallType
        };
      case 6:
        return {
          garageFinish: formValues.garageFinish,
          needSteps: formValues.needSteps
        };
      case 7:
        return {
          needExtraFootage: formValues.needExtraFootage,
          extraFootage: formValues.extraFootage
        };
      case 8:
        return {
          currentCondition: formValues.currentCondition
        };
      default:
        return {};
    }
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
        return !formValues.needStemWalls || formValues.needStemWalls === "yes" && !formValues.stemWallType;
      case 6:
        return !formValues.needSteps;
      case 7:
        return !formValues.needExtraFootage || formValues.needExtraFootage === "yes" && !formValues.extraFootage;
      case 8:
        return !formValues.currentCondition;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <LocationStep onLocationChange={value => setValue("location", value)} />;
      case 2:
        return <ContactStep register={register} />;
      case 3:
        return <GarageCapacityStep capacity={formValues.garageCapacity} onCapacityChange={([value]) => setValue("garageCapacity", value)} />;
      case 4:
        return <GarageFinishStep selectedFinish={selectedFinish} onFinishChange={value => setValue("garageFinish", value as "snowfall" | "granite" | "slate")} />;
      case 5:
        return <StemWallsStep needStemWalls={needStemWalls} stemWallType={formValues.stemWallType} onStemWallsChange={value => setValue("needStemWalls", value as "yes" | "no")} onStemWallTypeChange={value => setValue("stemWallType", value as "standard" | "large")} />;
      case 6:
        return <HouseStepsStep needSteps={needSteps} onNeedStepsChange={value => setValue("needSteps", value as "yes" | "no")} />;
      case 7:
        return <AdditionalFootageStep needExtraFootage={needExtraFootage} extraFootage={formValues.extraFootage} onNeedExtraFootageChange={value => setValue("needExtraFootage", value as "yes" | "no")} onExtraFootageChange={value => setValue("extraFootage", value as "up-to-50" | "51-100" | "101-150" | "151-200")} />;
      case 8:
        return <CurrentConditionStep condition={currentCondition} onConditionChange={value => setValue("currentCondition", value as "original" | "existing")} />;
      case 9:
        return <PaymentStep onBack={handlePrevStep} formData={formValues} totalCost={totalCost} />;
      default:
        return null;
    }
  };

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  const formContent = (
    <div className={`flex-grow ${isMobile ? 'pb-32' : ''}`}>
      {renderStep()}
    </div>
  );

  return <div className="h-full">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-stretch w-full h-full gap-0`}>
        <div className={`${isMobile ? 'w-full' : 'w-[40%]'} ${isMobile ? 'h-[35vh] min-h-[250px]' : 'h-full'}`}>
          <ImageDisplay totalCost={totalCost} step={step} options={getStepOptions()} />
        </div>
        
        <div className={`
          ${isMobile ? 'w-full' : 'w-[40%] border-x border-gray-200'} 
          bg-white p-4 sm:p-6
          ${isMobile ? 'min-h-[65vh] pb-40' : 'h-full'} 
          relative
        `}>
          <form onSubmit={handleSubmit(() => {})} className="h-full flex flex-col">
            {isMobile && step !== 9 ? (
              <ScrollArea className="h-[calc(65vh-100px)] pr-2">
                {formContent}
              </ScrollArea>
            ) : (
              formContent
            )}
            {step < 9 && (
              <FormNavigation step={step} onNext={handleNextStep} onPrev={handlePrevStep} isLastStep={step === 8} isNextDisabled={isNextDisabled()} />
            )}
          </form>
        </div>

        <div className={`
            ${isMobile ? 'w-full' : 'w-[20%]'} 
            bg-white p-6 
            ${isMobile ? 'h-auto' : 'h-full'} 
            overflow-y-auto
            ${isMobile && !showFAQ ? 'hidden' : ''}
          `}>
          {isMobile ? (
            <ScrollArea className="h-[calc(100vh-200px)]">
              {(step >= 3 || step <= 2 || step === 9) && <FAQSection step={step} />}
            </ScrollArea>
          ) : (
            (step >= 3 || step <= 2 || step === 9) && <FAQSection step={step} />
          )}
        </div>
      </div>
    </div>;
}
