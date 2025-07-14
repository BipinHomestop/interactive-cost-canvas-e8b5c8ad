
import { useState, useEffect, useCallback } from "react";
import { CalculatorInputs } from "@/components/calculator/types";
import { usePricingConfig } from "./use-pricing-config";
import { preserveCalculationData, getPreservedCalculationData } from "./utils/submission-db";

export const useCostCalculation = (formValues: Partial<CalculatorInputs>, step: number) => {
  const [totalCost, setTotalCost] = useState<number>(0);
  const { getPrice, getFinishMultiplier, isLoading, pricingConfig } = usePricingConfig();

  const DEFAULT_BASE_PRICE_1_CAR = 1000;
  const DEFAULT_BASE_PRICE_2_CAR = 2200;
  const DEFAULT_BASE_PRICE_3_CAR = 3500;
  const DEFAULT_BASE_PRICE_4_CAR = 5000;
  const DEFAULT_BASE_PRICE_5_CAR = 6500;
  const DEFAULT_STEM_WALL_STANDARD_PRICE = 500;
  const DEFAULT_STEM_WALL_LARGE_PRICE = 1000;
  const DEFAULT_STEPS_PRICE = 300;
  const DEFAULT_EXISTING_CONDITION_PRICE = 200;
  const DEFAULT_EXTRA_FOOTAGE_UP_TO_50 = 299;
  const DEFAULT_EXTRA_FOOTAGE_51_100 = 499;
  const DEFAULT_EXTRA_FOOTAGE_101_150 = 699;  // Fixed: should be 699, not 899
  const DEFAULT_EXTRA_FOOTAGE_151_200 = 899;  // Fixed: should be 899, not 699

  useEffect(() => {
    console.log('Step changed to:', step);
    
    if (step === 9) {
      const preservedPrice = getPreservedCalculationData();
      
      if (preservedPrice && preservedPrice > 0) {
        console.log('Using preserved price in step 9:', preservedPrice);
        setTotalCost(preservedPrice);
        return;
      }
    }
    
    calculateCost();
  }, [step]);

  useEffect(() => {
    const preservedCost = getPreservedCalculationData();
    if (preservedCost && preservedCost > 0 && totalCost === 0 && step === 9) {
      console.log('Initializing with preserved cost in step 9:', preservedCost);
      setTotalCost(preservedCost);
    }
  }, []);

  useEffect(() => {
    if (step === 9) {
      const preservedCost = getPreservedCalculationData();
      if (preservedCost && preservedCost > 0) {
        console.log("In step 9, using preserved cost:", preservedCost);
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
    if (step === 9) {
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
    
    if (formValues.garageFinish && step >= 4) {
      const multiplier = getFinishMultiplier(formValues.garageFinish);
      total = Math.round(total * multiplier);
      console.log(`After applying ${formValues.garageFinish} finish multiplier (${multiplier}):`, total);
    }
    
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
    
    if (step >= 6 && formValues.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', DEFAULT_STEPS_PRICE);
      total += stepsPrice;
      console.log(`After adding steps price (${stepsPrice}):`, total);
    }
    
    if (step >= 7 && formValues.needExtraFootage === "yes" && formValues.extraFootage) {
      const dbKey = formValues.extraFootage === "up-to-50" 
        ? "up_to_50" 
        : formValues.extraFootage.replace(/-/g, '_');
      
      const footageKey = `extra_footage_${dbKey}`;
      
      const fallbackPrices: { [key: string]: number } = {
        'up-to-50': DEFAULT_EXTRA_FOOTAGE_UP_TO_50,
        '51-100': DEFAULT_EXTRA_FOOTAGE_51_100,
        '101-150': DEFAULT_EXTRA_FOOTAGE_101_150,
        '151-200': DEFAULT_EXTRA_FOOTAGE_151_200
      };
      
      const fallbackPrice = fallbackPrices[formValues.extraFootage] || 0;
      const extraFootagePrice = getPrice(footageKey, fallbackPrice);
      
      console.log('Extra footage calculation details:', {
        selectedOption: formValues.extraFootage,
        dbKey,
        footageKey,
        fallbackPrice,
        configValue: pricingConfig[footageKey],
        finalPrice: extraFootagePrice
      });
      
      total += extraFootagePrice;
      console.log(`After adding extra footage price (${extraFootagePrice}):`, total);
    }

    if (formValues.currentCondition) {
      console.log('=== COST CALCULATION CONDITION DEBUG ===');
      console.log('formValues.currentCondition:', formValues.currentCondition);
      console.log('typeof currentCondition:', typeof formValues.currentCondition);
      console.log('condition === "existing":', formValues.currentCondition === "existing");
      
      if (formValues.currentCondition === "existing") {
        const conditionPrice = getPrice('existing_condition_price', DEFAULT_EXISTING_CONDITION_PRICE);
        total += conditionPrice;
        console.log(`Added existing condition price: ${conditionPrice}, new total: ${total}`);
      } else {
        console.log('Original condition - no additional cost, condition value:', formValues.currentCondition);
      }
      console.log('=== END COST CALCULATION CONDITION DEBUG ===');
    }
    
    total = Math.round(total);
    
    // Ensure we never return a zero or negative price after step 3
    if (step >= 3 && total <= 0) {
      console.warn("Calculated price was zero or negative, using minimum default price");
      total = DEFAULT_BASE_PRICE_1_CAR; // Use minimum base price as fallback
    }
    
    console.log("Final calculated cost for step", step, ":", total);
    
    setTotalCost(total);
    
    if (step === 9 && total > 0) {
      preserveCalculationData(total);
      console.log("Preserved calculation price in step 9:", total);
    }
  }, [formValues, step, getFinishMultiplier, getPrice, pricingConfig]);

  return { totalCost };
};
