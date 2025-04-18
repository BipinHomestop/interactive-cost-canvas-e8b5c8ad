
import { useState, useEffect } from "react";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { BreakdownItem } from "@/components/calculator/types";
import { formatFinishLabel } from "../utils/formatUtils";

interface UsePriceBreakdownProps {
  formData: any;
  totalCost: number;
  discountPercentage: number;
}

export function usePriceBreakdown({ formData, totalCost, discountPercentage }: UsePriceBreakdownProps) {
  const { getPrice, getFinishMultiplier } = usePricingConfig();
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    const items = generateBreakdownItems();
    setBreakdownItems(items);
    console.log('Generated breakdown items:', items);
  }, [formData, totalCost, discountPercentage]);

  const generateBreakdownItems = (): BreakdownItem[] => {
    const breakdown: BreakdownItem[] = [];
    let runningTotal = 0;

    // Base garage price
    if (formData.garageCapacity) {
      const baseKey = `base_price_${formData.garageCapacity}_car`;
      const garageBasePrice = getPrice(baseKey, 0);
      runningTotal += garageBasePrice;

      breakdown.push({
        label: `${formData.garageCapacity}-Car Garage (Base Price)`,
        price: garageBasePrice
      });
      console.log(`Base garage price:`, garageBasePrice);

      // Finish multiplier
      if (formData.garageFinish) {
        const multiplier = getFinishMultiplier(formData.garageFinish);
        const finishLabel = formatFinishLabel(formData.garageFinish);

        if (multiplier > 1) {
          const additionalCost = Math.round(garageBasePrice * (multiplier - 1));
          runningTotal += additionalCost;

          breakdown.push({
            label: `${finishLabel} Finish (${Math.round((multiplier - 1) * 100)}% premium)`,
            price: additionalCost
          });
          console.log(`Finish multiplier cost:`, additionalCost);
        }
      }
    }

    // Stem walls
    if (formData.needStemWalls === "yes") {
      const stemWallKey = formData.stemWallType === "standard" ? 
        'stem_wall_standard_price' : 'stem_wall_large_price';
      const stemWallPrice = getPrice(stemWallKey, 0);
      runningTotal += stemWallPrice;

      breakdown.push({
        label: `${formData.stemWallType === "standard" ? "Standard" : "Large"} Stem Walls`,
        price: stemWallPrice
      });
      console.log(`Stem wall price:`, stemWallPrice);
    }

    // Steps
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', 0);
      runningTotal += stepsPrice;
      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
      console.log(`Steps price:`, stepsPrice);
    }

    // Additional footage
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const footageKey = `extra_footage_${formData.extraFootage.replace(/-/g, '_')}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      runningTotal += extraFootagePrice;

      breakdown.push({
        label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
        price: extraFootagePrice
      });
      console.log(`Extra footage price:`, extraFootagePrice);
    }

    // Current condition costs
    if (formData.currentCondition) {
      const conditionKey = `${formData.currentCondition}_condition_price`;
      const conditionPrice = getPrice(conditionKey, 0);
      
      if (formData.currentCondition === "existing") {
        runningTotal += conditionPrice;
        breakdown.push({
          label: "Existing Coating Removal",
          price: conditionPrice
        });
        console.log(`Existing condition price:`, conditionPrice);
      } else if (formData.currentCondition === "original") {
        breakdown.push({
          label: "Original Concrete Preparation",
          price: 0
        });
        console.log(`Original condition price: 0`);
      }
    }

    // Add discount if applicable
    if (discountPercentage > 0) {
      const discountAmount = Math.round(totalCost * discountPercentage / 100) * -1;
      breakdown.push({
        label: `Discount (${discountPercentage}%)`,
        price: discountAmount
      });
      console.log(`Discount amount:`, discountAmount);
    }

    // Debug log for final calculations
    console.log('Price breakdown calculation:', {
      formData,
      totalCost,
      discountPercentage,
      breakdownItems: breakdown,
      runningTotal
    });

    return breakdown;
  };

  return { breakdownItems };
}
