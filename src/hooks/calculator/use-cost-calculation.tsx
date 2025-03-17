
import { useState, useEffect } from "react";
import { CalculatorInputs } from "@/components/calculator/types";

// Define finish price multipliers
const FINISH_PRICE_MULTIPLIERS: Record<string, number> = {
  "carbon": 1.1,
  "cabin-fever": 1.15,
  "creekbed": 1.2,
  "domino": 1.25,
  "nightfall": 1.3,
  "orbit": 1.35,
  "outback": 1.4,
  "pecan": 1.45,
  "shoreline": 1.5,
  "snowfall": 1.2, // Keeping the existing 1.2 multiplier for snowfall
  "tidal-wave": 1.55,
  "wombat": 1.6
};

// Default multiplier if a finish isn't found in the mapping
const DEFAULT_MULTIPLIER = 1.0;

export const useCostCalculation = (formValues: Partial<CalculatorInputs>, step: number) => {
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    if (step >= 3) {
      calculateCost();
    }
  }, [formValues, step]);

  const calculateCost = () => {
    let total = formValues.garageCapacity ? formValues.garageCapacity * 1000 : 0;
    
    // Apply finish-specific multiplier if available, otherwise use default
    const finishMultiplier = formValues.garageFinish 
      ? FINISH_PRICE_MULTIPLIERS[formValues.garageFinish] || DEFAULT_MULTIPLIER
      : DEFAULT_MULTIPLIER;
    
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

  return { totalCost };
};
