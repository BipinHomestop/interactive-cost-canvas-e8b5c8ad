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
  1: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=500&q=80",
  2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  3: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=500&q=80",
  4: {
    snowfall: "/lovable-uploads/36204769-3ce1-4ebb-bfab-01295ad47562.png",
    granite: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=500&q=80",
    slate: "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=500&q=80",
    modern: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&w=500&q=80",
    minimal: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&w=500&q=80",
    glass: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=500&q=80",
    classic: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&w=500&q=80",
    premium: "https://images.unsplash.com/photo-1487252665478-49b61b47f302?auto=format&fit=crop&w=500&q=80",
    deluxe: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=500&q=80"
  },
  5: {
    no: "/lovable-uploads/22ff454f-41d8-485e-a60d-cb7554661683.png",
    yes: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&q=80",
    standard: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=80",
    large: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&q=80"
  },
  6: "/lovable-uploads/bc589651-ce8c-4c4a-85cc-fca87bb964b1.png",
  7: "/lovable-uploads/3f8711ce-aed3-4ab1-88f7-6be8fd76b2fb.png",
  8: "/lovable-uploads/55651b0a-d0c0-4115-b0ba-f547a5825512.png",
  9: "/lovable-uploads/7cc4d8e8-47dd-42ff-860c-c3093c7fe23e.png"
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
