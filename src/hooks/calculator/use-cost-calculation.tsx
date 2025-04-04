
import { useState, useEffect, useCallback } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { usePricingConfig } from "./use-pricing-config";

export const useCostCalculation = (formValues: Partial<CalculatorInputs>, step: number) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const { getPrice, getFinishMultiplier, isLoading, pricingConfig, hasConfig } = usePricingConfig();

  // Default fallback values in case database fetch fails
  const DEFAULT_BASE_PRICE_1_CAR = 1000;
  const DEFAULT_BASE_PRICE_2_CAR = 2200;
  const DEFAULT_BASE_PRICE_3_CAR = 3500;
  const DEFAULT_BASE_PRICE_4_CAR = 5000;
  const DEFAULT_BASE_PRICE_5_CAR = 6500;
  const DEFAULT_STEM_WALL_STANDARD_PRICE = 500;
  const DEFAULT_STEM_WALL_LARGE_PRICE = 1000;
  const DEFAULT_STEPS_PRICE = 300;
  const DEFAULT_EXISTING_CONDITION_PRICE = 200;

  // Calculate the cost whenever relevant data changes
  useEffect(() => {
    console.log("Data changed - recalculating cost for step:", step);
    console.log("Form values:", formValues);
    calculateCost();
  }, [
    formValues.garageCapacity, 
    formValues.garageFinish, 
    formValues.needStemWalls, 
    formValues.stemWallType,
    formValues.needSteps,
    formValues.needExtraFootage,
    formValues.extraFootage,
    formValues.currentCondition,
    step,
    isLoading,
    pricingConfig
  ]);

  const calculateCost = useCallback(() => {
    console.log("Calculating cost with values:", formValues);
    console.log("Current step:", step);
    let total = 0;
    
    // Only include prices for steps that have been completed
    // Get appropriate base price for the selected garage capacity (after step 3)
    if (formValues.garageCapacity && step >= 3) {
      const baseKey = `base_price_${formValues.garageCapacity}_car`;
      let defaultBasePrice;
      
      switch (formValues.garageCapacity) {
        case 1: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR; break;
        case 2: defaultBasePrice = DEFAULT_BASE_PRICE_2_CAR; break;
        case 3: defaultBasePrice = DEFAULT_BASE_PRICE_3_CAR; break;
        case 4: defaultBasePrice = DEFAULT_BASE_PRICE_4_CAR; break;
        case 5: defaultBasePrice = DEFAULT_BASE_PRICE_5_CAR; break;
        default: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR;
      }
      
      total = getPrice(baseKey, defaultBasePrice);
      console.log(`Base price for ${formValues.garageCapacity} car garage:`, total);
    }
    
    // Apply finish-specific multiplier if available (after step 4)
    if (formValues.garageFinish && step >= 4) {
      const finishMultiplier = getFinishMultiplier(formValues.garageFinish);
      total = Math.round(total * finishMultiplier);
      console.log(`After applying ${formValues.garageFinish} finish multiplier (${finishMultiplier}):`, total);
    }
    
    // Add stem walls cost if needed (after step 5)
    if (step >= 5 && formValues.needStemWalls === "yes") {
      if (formValues.stemWallType === "standard") {
        const stemWallPrice = getPrice('stem_wall_standard_price', DEFAULT_STEM_WALL_STANDARD_PRICE);
        total += stemWallPrice;
        console.log(`After adding standard stem wall price (${stemWallPrice}):`, total);
      } else if (formValues.stemWallType === "large") {
        const stemWallPrice = getPrice('stem_wall_large_price', DEFAULT_STEM_WALL_LARGE_PRICE);
        total += stemWallPrice;
        console.log(`After adding large stem wall price (${stemWallPrice}):`, total);
      }
    }
    
    // Add steps cost if needed (after step 6)
    if (step >= 6 && formValues.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', DEFAULT_STEPS_PRICE);
      total += stepsPrice;
      console.log(`After adding steps price (${stepsPrice}):`, total);
    }
    
    // Add extra footage cost if needed (after step 7)
    if (step >= 7 && formValues.needExtraFootage === "yes" && formValues.extraFootage) {
      const footageKey = `extra_footage_${formValues.extraFootage.replace(/-/g, '_')}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      total += extraFootagePrice;
      console.log(`After adding extra footage price (${extraFootagePrice}):`, total);
    }

    // Add existing condition cost if applicable (after step 8)
    if (step >= 8 && formValues.currentCondition === "existing") {
      const existingConditionPrice = getPrice('existing_condition_price', DEFAULT_EXISTING_CONDITION_PRICE);
      total += existingConditionPrice;
      console.log(`After adding existing condition price (${existingConditionPrice}):`, total);
    }
    
    // Round to nearest whole number
    total = Math.round(total);
    console.log("Final calculated cost for step", step, ":", total);
    setTotalCost(total);
  }, [formValues, step, getFinishMultiplier, getPrice]);

  return { totalCost };
};
