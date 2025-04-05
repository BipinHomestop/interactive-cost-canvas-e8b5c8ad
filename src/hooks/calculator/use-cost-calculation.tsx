
import { useState, useEffect, useCallback } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { usePricingConfig } from "./use-pricing-config";
import { preserveCalculationData, getPreservedCalculationData } from "./utils/submission-db";

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

  // Check for preserved data on step changes
  useEffect(() => {
    console.log('Step changed to:', step);
    
    // When entering or leaving the last two steps, handle preserved price
    if (step >= 8 || step === 9) {
      const preservedPrice = getPreservedCalculationData();
      
      if (preservedPrice && preservedPrice > 0) {
        console.log('Using preserved price in cost calculation hook:', preservedPrice);
        setTotalCost(preservedPrice);
        return;
      }
    }
    
    // For earlier steps, calculate the cost normally
    if (step < 8) {
      calculateCost();
    }
  }, [step]);

  // Initialize from preserved data if available
  useEffect(() => {
    const preservedCost = getPreservedCalculationData();
    if (preservedCost && preservedCost > 0 && totalCost === 0) {
      console.log('Initializing with preserved cost:', preservedCost);
      setTotalCost(preservedCost);
    }
  }, []);

  // Calculate the cost whenever relevant data changes
  useEffect(() => {
    // Skip recalculation at payment step (9) or if we're using preserved data (step 8)
    if (step === 9 || step === 8) {
      const preservedCost = getPreservedCalculationData();
      if (preservedCost && preservedCost > 0) {
        console.log("In step 8 or 9, using preserved cost:", preservedCost);
        setTotalCost(preservedCost);
        return;
      }
    }
    
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
    isLoading,
    pricingConfig
  ]);

  const calculateCost = useCallback(() => {
    // Check if we're at step 8 or 9 (last step before payment or payment step)
    if (step === 8 || step === 9) {
      const preservedCost = getPreservedCalculationData();
      if (preservedCost && preservedCost > 0) {
        console.log("Using preserved cost from previous calculation:", preservedCost);
        setTotalCost(preservedCost);
        return;
      }
    }

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
    
    // Store the calculated price
    setTotalCost(total);
    
    // Also preserve it in session storage to maintain state when returning from payment
    if (step >= 8 && total > 0) {
      preserveCalculationData(total);
      console.log("Preserved calculation price in session storage:", total);
    }
  }, [formValues, step, getFinishMultiplier, getPrice]);

  return { totalCost };
};
