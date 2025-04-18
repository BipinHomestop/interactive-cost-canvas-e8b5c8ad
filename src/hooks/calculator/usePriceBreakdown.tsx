
import { useState, useEffect } from "react";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { BreakdownItem } from "@/components/calculator/types";
import { formatFinishLabel } from "@/components/calculator/payment/utils/formatUtils";

interface UsePriceBreakdownProps {
  formData: any;
  totalCost: number;
  discountPercentage: number;
}

export function usePriceBreakdown({ formData, totalCost, discountPercentage }: UsePriceBreakdownProps) {
  const { getPrice, getFinishMultiplier, isLoading } = usePricingConfig();
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    if (isLoading) {
      console.log('Waiting for pricing config to load...');
      return;
    }

    console.log('Generating breakdown with:', { 
      formData, 
      totalCost, 
      discountPercentage,
      currentCondition: formData.currentCondition,
      extraFootage: formData.extraFootage,
      needExtraFootage: formData.needExtraFootage
    });
    
    const items = generateBreakdownItems();
    setBreakdownItems(items);
  }, [formData, totalCost, discountPercentage, isLoading, formData.currentCondition, formData.extraFootage]);

  const generateBreakdownItems = (): BreakdownItem[] => {
    const breakdown: BreakdownItem[] = [];
    let runningTotal = 0;

    // Base garage price
    if (formData.garageCapacity) {
      const baseKey = `base_price_${formData.garageCapacity}_car`;
      const basePrice = getPrice(baseKey, 0);
      runningTotal += basePrice;

      console.log(`Base price calculation:`, {
        key: baseKey,
        price: basePrice
      });

      breakdown.push({
        label: `${formData.garageCapacity}-Car Garage (Base Price)`,
        price: basePrice
      });

      // Finish multiplier
      if (formData.garageFinish) {
        const multiplier = getFinishMultiplier(formData.garageFinish);
        const finishLabel = formatFinishLabel(formData.garageFinish);
        
        console.log(`Finish calculation:`, {
          finish: formData.garageFinish,
          multiplier,
          basePrice
        });

        if (multiplier > 1) {
          const additionalCost = Math.round(basePrice * (multiplier - 1));
          runningTotal += additionalCost;

          breakdown.push({
            label: `${finishLabel} Finish (${Math.round((multiplier - 1) * 100)}% premium)`,
            price: additionalCost
          });
        }
      }
    }

    // Stem walls
    if (formData.needStemWalls === "yes") {
      const stemWallKey = formData.stemWallType === "standard" ? 
        'stem_wall_standard_price' : 'stem_wall_large_price';
      const stemWallPrice = getPrice(stemWallKey, 0);
      runningTotal += stemWallPrice;

      console.log(`Stem wall calculation:`, {
        type: formData.stemWallType,
        key: stemWallKey,
        price: stemWallPrice
      });

      breakdown.push({
        label: `${formData.stemWallType === "standard" ? "Standard" : "Large"} Stem Walls`,
        price: stemWallPrice
      });
    }

    // Steps
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', 0);
      runningTotal += stepsPrice;

      console.log(`Steps calculation:`, {
        price: stepsPrice
      });

      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
    }

    // Additional footage
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      // Handle the special case for "up-to-50"
      const dbKey = formData.extraFootage === "up-to-50" ? "up_to_50" 
                   : formData.extraFootage.replace(/-/g, '_');
      
      const footageKey = `extra_footage_${dbKey}`;
      
      // Set fallback prices based on range - IMPORTANT: ensuring the correct fallback values
      const fallbackPrices: { [key: string]: number } = {
        'up-to-50': 299,
        '51-100': 499,
        '101-150': 899,  // Ensuring this is correctly set to 899
        '151-200': 699   // Ensuring this is correctly set to 699
      };

      const fallbackPrice = fallbackPrices[formData.extraFootage] || 0;
      const extraFootagePrice = getPrice(footageKey, fallbackPrice);
      runningTotal += extraFootagePrice;

      console.log(`Extra footage calculation:`, {
        selected: formData.extraFootage,
        dbKey: dbKey,
        key: footageKey,
        fallback: fallbackPrice,
        price: extraFootagePrice
      });

      breakdown.push({
        label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
        price: extraFootagePrice
      });
    }

    // Current condition
    if (formData.currentCondition) {
      if (formData.currentCondition === "existing") {
        const conditionPrice = getPrice('existing_condition_price', 200);
        runningTotal += conditionPrice;

        console.log(`Existing condition price calculated:`, {
          price: conditionPrice,
          runningTotal
        });

        breakdown.push({
          label: "Existing Coating Removal",
          price: conditionPrice
        });
      } else {
        console.log('Original condition selected - no additional cost');
        breakdown.push({
          label: "Original Concrete Preparation",
          price: 0
        });
      }
    }

    // Add discount if applicable
    if (discountPercentage > 0) {
      const discountAmount = Math.round(totalCost * (discountPercentage / 100)) * -1;
      
      console.log(`Discount calculation:`, {
        percentage: discountPercentage,
        totalCost,
        amount: discountAmount
      });

      breakdown.push({
        label: `Discount (${discountPercentage}%)`,
        price: discountAmount
      });
    }

    console.log('Final breakdown calculation:', {
      items: breakdown,
      runningTotal,
      expectedTotal: totalCost,
      currentCondition: formData.currentCondition,
      extraFootage: formData.extraFootage
    });

    return breakdown;
  };

  return { breakdownItems, isLoading };
}
