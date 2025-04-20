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
  const { getPrice, getFinishMultiplier, isLoading } = usePricingConfig();
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);

  // Check for cached items on mount
  useEffect(() => {
    try {
      const cachedItems = sessionStorage.getItem('cachedBreakdownItems');
      if (cachedItems && step === 9) {
        const parsed = JSON.parse(cachedItems);
        console.log('Retrieved cached breakdown items:', parsed);
        setBreakdownItems(parsed);
        return;
      }
    } catch (error) {
      console.error('Error retrieving cached breakdown items:', error);
    }
    
    if (!isLoading) {
      const items = generateBreakdownItems();
      setBreakdownItems(items);
    }
  }, [isLoading]);

  // Only regenerate items if we're not in step 9 or if specific values change
  useEffect(() => {
    if (isLoading) {
      console.log('Waiting for pricing config to load...');
      return;
    }

    // Don't regenerate in step 9 if we have cached items
    if (step === 9) {
      const cachedItems = sessionStorage.getItem('cachedBreakdownItems');
      if (cachedItems) {
        return;
      }
    }

    console.log('Generating breakdown with:', { formData, totalCost, discountPercentage });
    const items = generateBreakdownItems();
    setBreakdownItems(items);
  }, [formData, totalCost, discountPercentage, isLoading]);

  const generateBreakdownItems = (): BreakdownItem[] => {
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
      
      // Use a minimum price if the base price is invalid
      const validBasePrice = basePrice > 0 ? basePrice : 1000;
      runningTotal += validBasePrice;

      console.log(`Base price calculation:`, {
        key: baseKey,
        price: basePrice,
        validPrice: validBasePrice
      });

      breakdown.push({
        label: `${formData.garageCapacity}-Car Garage (Base Price)`,
        price: validBasePrice
      });

      // Finish multiplier
      if (formData.garageFinish) {
        const multiplier = getFinishMultiplier(formData.garageFinish);
        // Ensure multiplier is valid and at least 1.0
        const validMultiplier = multiplier >= 1.0 ? multiplier : 1.0;
        
        console.log(`Finish calculation:`, {
          finish: formData.garageFinish,
          multiplier,
          validMultiplier,
          basePrice: validBasePrice
        });

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
      
      // Set fallback prices based on range
      const fallbackPrices: { [key: string]: number } = {
        'up-to-50': 299,
        '51-100': 499,
        '101-150': 899,
        '151-200': 699
      };

      const fallbackPrice = fallbackPrices[formData.extraFootage] || 0;
      const extraFootagePrice = getPrice(footageKey, fallbackPrice);
      runningTotal += extraFootagePrice;

      console.log(`Extra footage calculation:`, {
        selected: formData.extraFootage,
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

        console.log(`Existing condition price:`, conditionPrice);

        breakdown.push({
          label: "Existing Coating Removal",
          price: conditionPrice
        });
      } else {
        console.log('Original condition - no additional cost');
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
      expectedTotal: totalCost
    });

    return breakdown;
  };

  return { breakdownItems, isLoading };
}
