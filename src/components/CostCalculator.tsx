import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { LocationStep } from "./calculator/LocationStep";
import { ContactStep } from "./calculator/ContactStep";
import { GarageCapacityStep } from "./calculator/GarageCapacityStep";
import { GarageFinishStep } from "./calculator/GarageFinishStep";
import { StemWallsStep } from "./calculator/StemWallsStep";
import { CalculatorInputs, StepImages } from "./calculator/types";

const STEP_IMAGES: StepImages = {
  1: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=500&q=80",
  2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  3: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=500&q=80",
  4: {
    snowfall: "/lovable-uploads/36204769-3ce1-4ebb-bfab-01295ad47562.png",
    granite: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
    slate: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
  },
  5: {
    no: "/lovable-uploads/22ff454f-41d8-485e-a60d-cb7554661683.png",
    yes: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&q=80",
    standard: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=80",
    large: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&q=80"
  }
};

export function CostCalculator() {
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState<number>(0);
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
    },
  });

  const formValues = useWatch({ control });
  const selectedFinish = watch("garageFinish");
  const needStemWalls = watch("needStemWalls");

  useEffect(() => {
    if (step >= 3) {
      calculateCost();
    }
  }, [formValues, step]);

  const calculateCost = () => {
    const basePrice = formValues.garageCapacity * 1000;
    const finishMultiplier = formValues.garageFinish === "snowfall" ? 1.2 : 1;
    let total = basePrice * finishMultiplier;

    if (formValues.needStemWalls === "yes") {
      total += formValues.stemWallType === "standard" ? 500 : 1000;
    }
    
    setTotalCost(total);
  };

  const getStepImage = () => {
    const image = STEP_IMAGES[step];
    if (typeof image === 'string') return image;
    if (step === 4) {
      return image[selectedFinish] || image.snowfall;
    }
    if (step === 5) {
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

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

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
            onFinishChange={(value) => setValue("garageFinish", value)}
          />
        );
      case 5:
        return (
          <StemWallsStep
            needStemWalls={needStemWalls}
            stemWallType={formValues.stemWallType}
            onStemWallsChange={(value) => setValue("needStemWalls", value)}
            onStemWallTypeChange={(value) => setValue("stemWallType", value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex gap-8 items-stretch">
      <div className="w-1/2 relative">
        <img
          src={getStepImage()}
          alt={`Step ${step} visualization`}
          className="w-full rounded-lg shadow-lg h-[600px] object-cover"
        />
        {step >= 3 && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#0A0B3B] text-white p-4 rounded-b-lg">
            <div className="text-2xl font-bold">
              Your Price: ${totalCost.toLocaleString()}
            </div>
            <div className="text-[#FFA500]">
              Market Price: ${Math.round(totalCost * 1.4).toLocaleString()}
            </div>
          </div>
        )}
      </div>
      
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md h-[600px] overflow-y-auto">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 h-2 mx-1 rounded ${
                  stepNumber <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {step} of 5
          </div>
        </div>

        <form onSubmit={handleSubmit(calculateCost)} className="space-y-6">
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            )}
            {step < 5 && (
              <Button
                type="button"
                className="ml-auto bg-[#0A0B3B]"
                onClick={nextStep}
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}