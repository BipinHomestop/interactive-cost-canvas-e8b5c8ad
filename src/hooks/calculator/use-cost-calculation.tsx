
import { useState, useEffect } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { usePricingConfig } from "./use-pricing-config";

export const useCostCalculation = (formValues: Partial<CalculatorInputs>, step: number) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const { getPrice, getFinishMultiplier, isLoading } = usePricingConfig();

  // Default fallback values in case database fetch fails
  const DEFAULT_BASE_PRICE = 1000;
  const DEFAULT_STEM_WALL_STANDARD_PRICE = 500;
  const DEFAULT_STEM_WALL_LARGE_PRICE = 1000;
  const DEFAULT_STEPS_PRICE = 300;
  const DEFAULT_EXISTING_CONDITION_PRICE = 200;

  useEffect(() => {
    if (step >= 3) {
      calculateCost();
    }
  }, [formValues, step, isLoading]);

  const calculateCost = () => {
    // Get base price per car garage
    const basePrice = getPrice('base_price_per_car', DEFAULT_BASE_PRICE);
    let total = formValues.garageCapacity ? formValues.garageCapacity * basePrice : 0;
    
    // Apply finish-specific multiplier if available
    if (formValues.garageFinish) {
      const finishMultiplier = getFinishMultiplier(formValues.garageFinish);
      total *= finishMultiplier;
    }
    
    // Add stem walls cost if needed
    if (formValues.needStemWalls === "yes") {
      if (formValues.stemWallType === "standard") {
        total += getPrice('stem_wall_standard_price', DEFAULT_STEM_WALL_STANDARD_PRICE);
      } else {
        total += getPrice('stem_wall_large_price', DEFAULT_STEM_WALL_LARGE_PRICE);
      }
    }
    
    // Add steps cost if needed
    if (formValues.needSteps === "yes") {
      total += getPrice('steps_price', DEFAULT_STEPS_PRICE);
    }
    
    // Add extra footage cost if needed
    if (formValues.needExtraFootage === "yes" && formValues.extraFootage) {
      const footageKey = `extra_footage_${formValues.extraFootage.replace(/-/g, '_')}`;
      total += getPrice(footageKey, 0);
    }

    // Add existing condition cost if applicable
    if (formValues.currentCondition === "existing") {
      total += getPrice('existing_condition_price', DEFAULT_EXISTING_CONDITION_PRICE);
    }
    
    setTotalCost(total);
  };

  return { totalCost };
};
