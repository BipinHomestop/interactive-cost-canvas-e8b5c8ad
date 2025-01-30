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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

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

  const getFAQs = (step: number) => {
    switch (step) {
      case 3:
        return [
          {
            question: "How many cars can fit in different garage sizes?",
            answer: "A single car garage typically fits one car, a double garage fits two cars, and so on. Consider extra space for storage or workspace when choosing."
          },
          {
            question: "What's the recommended size for my needs?",
            answer: "Consider your vehicle sizes, storage needs, and available space. We can help you determine the best size during consultation."
          },
          {
            question: "Can I expand the garage later?",
            answer: "While possible, it's more cost-effective to build the right size initially. Plan for future needs when choosing your garage capacity."
          },
          {
            question: "Do you offer custom sizes?",
            answer: "Yes, we can customize garage sizes to meet your specific needs while adhering to local building codes."
          }
        ];
      case 4:
        return [
          {
            question: "Does the finish affect the price?",
            answer: "Yes, different finishes have varying costs. Premium finishes like granite or slate may affect the final price."
          },
          {
            question: "What's the most popular finish?",
            answer: "The Snowfall finish is our most popular choice, offering a clean and modern look that complements most home styles."
          },
          {
            question: "Will the finish fade or change color over time?",
            answer: "Our finishes are designed to be long-lasting and resistant to fading. They maintain their color and appearance for many years with proper maintenance."
          },
          {
            question: "How do I choose the best color for my garage?",
            answer: "Consider your home's exterior colors, architectural style, and personal preferences. We recommend selecting a finish that complements your home's existing color scheme."
          }
        ];
      case 5:
        return [
          {
            question: "What are stem walls?",
            answer: "Stem walls are vertical concrete surfaces that form the foundation of your garage, providing structural support and stability."
          },
          {
            question: "Do I need stem walls?",
            answer: "It depends on your garage design and local building requirements. Our team can assess your specific needs during consultation."
          },
          {
            question: "What's the difference between standard and large stem walls?",
            answer: "Standard stem walls are 4 inches thick, while large stem walls offer additional support for larger structures or specific soil conditions."
          },
          {
            question: "How long do stem walls last?",
            answer: "Properly constructed stem walls can last the lifetime of your garage with minimal maintenance."
          }
        ];
      case 6:
        return [
          {
            question: "Why might I need steps?",
            answer: "Steps are necessary when there's a height difference between your house and garage entrance for safe and convenient access."
          },
          {
            question: "What types of steps are available?",
            answer: "We offer various step designs that can be customized to match your home's style and meet safety requirements."
          },
          {
            question: "Are the steps covered by warranty?",
            answer: "Yes, our steps are covered under our comprehensive warranty package, ensuring long-lasting quality and safety."
          },
          {
            question: "Can steps be added later?",
            answer: "While possible, it's more cost-effective to include steps in the initial construction if you think you'll need them."
          }
        ];
      case 7:
        return [
          {
            question: "What is additional square footage?",
            answer: "Additional square footage refers to extra space added to your garage beyond the standard size for storage or workspace."
          },
          {
            question: "How much extra space should I add?",
            answer: "Consider your storage needs, workspace requirements, and future plans when deciding on additional square footage."
          },
          {
            question: "Does extra footage affect permits?",
            answer: "Yes, additional square footage may affect building permits and local zoning requirements. We'll handle all necessary paperwork."
          },
          {
            question: "Can I add space later?",
            answer: "While possible, it's more cost-effective to include the desired space in the initial construction."
          }
        ];
      case 8:
        return [
          {
            question: "What's the difference between original and existing conditions?",
            answer: "Original means no previous coating, while existing means there's an old coating that needs removal before application."
          },
          {
            question: "How is existing coating removed?",
            answer: "We use professional-grade equipment and techniques to safely remove existing coatings without damaging the surface."
          },
          {
            question: "Does removal affect the timeline?",
            answer: "Yes, removing existing coating adds some time to the project, but it's necessary for proper application."
          },
          {
            question: "Can you apply over existing coating?",
            answer: "For best results and longevity, we recommend removing existing coatings before applying new ones."
          }
        ];
      default:
        return [];
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
        return <PaymentStep onBack={prevStep} formData={formValues} totalCost={totalCost} />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-stretch`}>
      <div className={`${isMobile ? 'w-full mb-6' : 'w-[30%]'}`}>
        <ImageDisplay
          imageSrc={getStepImage()}
          totalCost={totalCost}
          step={step}
        />
      </div>
      
      <div className={`${isMobile ? 'w-full' : 'w-[40%]'} bg-white p-6 ${isMobile ? 'h-auto' : 'h-[600px]'} overflow-y-auto`}>
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

      {!isMobile && <Separator orientation="vertical" className="h-[600px]" />}

      <div className={`${isMobile ? 'w-full mt-6' : 'w-[30%]'} bg-white p-6 ${isMobile ? 'h-auto' : 'h-[600px]'} overflow-y-auto`}>
        {step >= 3 ? (
          <>
            <h2 className="text-xl font-bold mb-6 text-[#1A3174] text-left">FAQ's</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {getFAQs(step).map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index + 1}`} 
                  className="border rounded-lg bg-white shadow-sm"
                >
                  <AccordionTrigger className="px-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        ) : null}
      </div>
    </div>
  );
}
