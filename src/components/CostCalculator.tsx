import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { CalculatorInputs, StepImages } from "./calculator/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const STEP_IMAGES: StepImages = {
  1: "/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png",
  2: "/lovable-uploads/a03bc655-a297-49c7-9c75-9f058f06a1f0.png",
  3: "/lovable-uploads/2bb89b6f-c394-4d76-93ee-047d82eb9749.png",
  4: {
    snowfall: "/lovable-uploads/227500dc-42d6-4f5f-a573-d2aa8a8b5d11.png",
    granite: "/lovable-uploads/72033eb4-1949-420d-b7fe-c85dfeb3655c.png",
    slate: "/lovable-uploads/df962712-ee4f-4d54-931c-000bf94d6296.png",
    modern: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png",
    minimal: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png",
    glass: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png",
    classic: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png",
    premium: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png",
    deluxe: "/lovable-uploads/9fcb107b-3e3b-4008-a68c-5da69b27da6e.png"
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
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const { register, handleSubmit, setValue, watch, control } = useForm<CalculatorInputs>({
    defaultValues: {
      location: "",
      name: "",
      phone: "",
      email: "",
      garageCapacity: 1,
      garageFinish: "snowfall",
      needStemWalls: "no",
      stemWallType: undefined,
      needSteps: "no",
      needExtraFootage: "no",
      extraFootage: undefined,
      currentCondition: "original"
    },
  });

  const formValues = useWatch({ control });
  const selectedFinish = watch("garageFinish");
  const needStemWalls = watch("needStemWalls");
  const needSteps = watch("needSteps");
  const needExtraFootage = watch("needExtraFootage");
  const currentCondition = watch("currentCondition");

  useEffect(() => {
    if (step >= 3) {
      calculateCost();
    }
  }, [formValues, step]);

  const calculateCost = () => {
    let total = formValues.garageCapacity * 1000;
    
    const finishMultiplier = formValues.garageFinish === "snowfall" ? 1.2 : 1;
    total *= finishMultiplier;
    
    if (formValues.needStemWalls === "yes") {
      total += formValues.stemWallType === "standard" ? 500 : 1000;
    }
    
    if (formValues.needSteps === "yes") {
      total += 300;
    }
    
    if (formValues.needExtraFootage === "yes" && formValues.extraFootage) {
      const footageCosts = {
        "up-to-50": 200,
        "51-100": 400,
        "101-150": 600,
        "151-200": 800,
      };
      total += footageCosts[formValues.extraFootage] || 0;
    }

    if (formValues.currentCondition === "existing") {
      total += 200;
    }
    
    setTotalCost(total);
  };

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

  const nextStep = async () => {
    if (step === 2) {
      if (!formValues.name || !formValues.phone || !formValues.email) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cost_calculator_submissions')
          .insert([{
            location: formValues.location,
            name: formValues.name,
            phone: formValues.phone,
            email: formValues.email,
            garage_capacity: formValues.garageCapacity,
            garage_finish: formValues.garageFinish,
            need_stem_walls: formValues.needStemWalls,
            stem_wall_type: formValues.stemWallType,
            need_steps: formValues.needSteps,
            need_extra_footage: formValues.needExtraFootage,
            extra_footage: formValues.extraFootage,
            current_condition: formValues.currentCondition
          }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setSubmissionId(data[0].id);
        }

        toast({
          title: "Success",
          description: "Your information has been saved",
          className: "bg-green-500 text-white border-none",
        });
      } catch (error) {
        console.error('Error saving data:', error);
        toast({
          title: "Error",
          description: "Failed to save your information",
          variant: "destructive",
        });
        return;
      }
    } else if (submissionId && step > 2) {
      try {
        const { error } = await supabase
          .from('cost_calculator_submissions')
          .update({
            garage_capacity: formValues.garageCapacity,
            garage_finish: formValues.garageFinish,
            need_stem_walls: formValues.needStemWalls,
            stem_wall_type: formValues.stemWallType,
            need_steps: formValues.needSteps,
            need_extra_footage: formValues.needExtraFootage,
            extra_footage: formValues.extraFootage,
            current_condition: formValues.currentCondition
          })
          .eq('id', submissionId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating data:', error);
        toast({
          title: "Error",
          description: "Failed to update your information",
          variant: "destructive",
        });
        return;
      }
    }
    
    setStep((prev) => Math.min(prev + 1, 9));
  };

  const prevStep = async () => {
    if (submissionId && step > 2) {
      try {
        const { error } = await supabase
          .from('cost_calculator_submissions')
          .update({
            garage_capacity: formValues.garageCapacity,
            garage_finish: formValues.garageFinish,
            need_stem_walls: formValues.needStemWalls,
            stem_wall_type: formValues.stemWallType,
            need_steps: formValues.needSteps,
            need_extra_footage: formValues.needExtraFootage,
            extra_footage: formValues.extraFootage,
            current_condition: formValues.currentCondition
          })
          .eq('id', submissionId);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating data:', error);
        toast({
          title: "Error",
          description: "Failed to update your information",
          variant: "destructive",
        });
      }
    }
    setStep((prev) => Math.max(prev - 1, 1));
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
        return <PaymentStep onBack={prevStep} formData={formValues} totalCost={totalCost} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'gap-8'} items-stretch`}>
      <div className={`${isMobile ? 'w-full mb-6' : 'w-1/2'}`}>
        <ImageDisplay
          imageSrc={getStepImage()}
          totalCost={totalCost}
          step={step}
        />
      </div>
      
      <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-white p-6 rounded-lg shadow-md ${isMobile ? 'h-auto' : 'h-[600px]'} overflow-y-auto`}>
        {step < 9 && (
          <div className="mb-8">
            <div className="text-center text-sm text-gray-600">
              Step {step} of 8
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(calculateCost)} className="space-y-6">
          {renderStep()}
          {step < 9 && (
            <FormNavigation
              step={step}
              onNext={nextStep}
              onPrev={prevStep}
              isLastStep={step === 8}
            />
          )}
        </form>
      </div>
    </div>
  );
}
