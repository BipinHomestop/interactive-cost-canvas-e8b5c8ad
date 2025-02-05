import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { CalculatorInputs } from "@/components/calculator/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCalculator = () => {
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  const handleNextStep = async () => {
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

  const handlePrevStep = async () => {
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

  return {
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
  };
};
