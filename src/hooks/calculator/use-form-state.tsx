
import { useForm, useWatch } from "react-hook-form";
import { CalculatorInputs } from "@/components/calculator/types";

export const useFormState = () => {
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

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formValues,
    selectedFinish,
    needStemWalls,
    needSteps,
    needExtraFootage,
    currentCondition
  };
};
