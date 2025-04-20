
import { BreakdownItem } from "@/components/calculator/types";
import { formatFinishLabel } from "./formatUtils";

interface GenerateBreakdownItemsProps {
  formData: any;
  totalCost: number;
  discountPercentage: number;
  getPrice: (key: string, fallback: number) => number;
  getFinishMultiplier: (finishType: string) => number;
}

export function generateBreakdownItems({
  formData,
  totalCost,
  discountPercentage,
  getPrice,
  getFinishMultiplier
}: GenerateBreakdownItemsProps): BreakdownItem[] {
  // Return empty array if totalCost is invalid
  if (totalCost <= 0) {
    console.log('Skipping breakdown generation due to invalid totalCost');
    return [];
  }

  const breakdown: BreakdownItem[] = [];
  let runningTotal = 0;

  // Base garage price
  if (formData.garageCapacity) {
    const baseKey = `base_price_${formData.garageCapacity}_car`;
    const basePrice = getPrice(baseKey, 0);
    const validBasePrice = basePrice > 0 ? basePrice : 1000;
    runningTotal += validBasePrice;

    breakdown.push({
      label: `${formData.garageCapacity}-Car Garage (Base Price)`,
      price: validBasePrice
    });

    // Finish multiplier
    if (formData.garageFinish) {
      const multiplier = getFinishMultiplier(formData.garageFinish);
      const validMultiplier = multiplier >= 1.0 ? multiplier : 1.0;
      
      if (validMultiplier > 1) {
        const additionalCost = Math.round(validBasePrice * (validMultiplier - 1));
        runningTotal += additionalCost;

        breakdown.push({
          label: `${formatFinishLabel(formData.garageFinish)} Finish (${Math.round((validMultiplier - 1) * 100)}% premium)`,
          price: additionalCost
        });
      }
    }
  }

  // Add stem walls
  if (formData.needStemWalls === "yes") {
    const stemWallKey = formData.stemWallType === "standard" ? 
      'stem_wall_standard_price' : 'stem_wall_large_price';
    const stemWallPrice = getPrice(stemWallKey, 0);
    runningTotal += stemWallPrice;

    breakdown.push({
      label: `${formData.stemWallType === "standard" ? "Standard" : "Large"} Stem Walls`,
      price: stemWallPrice
    });
  }

  // Add steps
  if (formData.needSteps === "yes") {
    const stepsPrice = getPrice('steps_price', 0);
    runningTotal += stepsPrice;

    breakdown.push({
      label: "House Steps",
      price: stepsPrice
    });
  }

  // Add extra footage
  if (formData.needExtraFootage === "yes" && formData.extraFootage) {
    const dbKey = formData.extraFootage === "up-to-50" ? "up_to_50" 
                 : formData.extraFootage.replace(/-/g, '_');
    
    const footageKey = `extra_footage_${dbKey}`;
    const fallbackPrices: { [key: string]: number } = {
      'up-to-50': 299,
      '51-100': 499,
      '101-150': 899,
      '151-200': 699
    };

    const fallbackPrice = fallbackPrices[formData.extraFootage] || 0;
    const extraFootagePrice = getPrice(footageKey, fallbackPrice);
    runningTotal += extraFootagePrice;

    breakdown.push({
      label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
      price: extraFootagePrice
    });
  }

  // Add current condition
  if (formData.currentCondition) {
    if (formData.currentCondition === "existing") {
      const conditionPrice = getPrice('existing_condition_price', 200);
      runningTotal += conditionPrice;

      breakdown.push({
        label: "Existing Coating Removal",
        price: conditionPrice
      });
    } else {
      breakdown.push({
        label: "Original Concrete Preparation",
        price: 0
      });
    }
  }

  // Add discount if applicable
  if (discountPercentage > 0) {
    const discountAmount = Math.round(totalCost * (discountPercentage / 100)) * -1;
    
    breakdown.push({
      label: `Discount (${discountPercentage}%)`,
      price: discountAmount
    });
  }

  return breakdown;
}
