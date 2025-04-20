
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

  // Try to load cached breakdown items on mount
  useEffect(() => {
    try {
      const cachedItems = sessionStorage.getItem('cachedBreakdownItems');
      if (cachedItems) {
        const parsedItems = JSON.parse(cachedItems);
        console.log('Found cached breakdown items:', parsedItems);
        
        // Validate cached items match current total
        const cachedTotal = parsedItems.reduce((sum: number, item: BreakdownItem) => sum + item.price, 0);
        if (Math.abs(cachedTotal - totalCost) <= 1) {
          console.log('Using cached breakdown items - totals match');
          setBreakdownItems(parsedItems);
          return;
        } else {
          console.log('Cached breakdown items total mismatch:', { 
            cachedTotal, 
            expectedTotal: totalCost 
          });
        }
      }
    } catch (error) {
      console.error('Error reading cached breakdown items:', error);
    }
  }, [totalCost]);

  useEffect(() => {
    if (isLoading) {
      console.log('Waiting for pricing config to load...');
      return;
    }

    // Only generate new items if we don't have valid cached ones
    if (breakdownItems.length === 0) {
      console.log('Generating new breakdown with:', { 
        formData, 
        totalCost, 
        discountPercentage
      });
      
      const items = generateBreakdownItems();
      setBreakdownItems(items);

      // Cache the new items
      try {
        sessionStorage.setItem('cachedBreakdownItems', JSON.stringify(items));
        console.log('Cached new breakdown items');
      } catch (error) {
        console.error('Error caching breakdown items:', error);
      }
    }
  }, [formData, totalCost, discountPercentage, isLoading, breakdownItems.length]);

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

      breakdown.push({
        label: `${formData.stemWallType === "standard" ? "Standard" : "Large"} Stem Walls`,
        price: stemWallPrice
      });
    }

    // Steps
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', 0);
      runningTotal += stepsPrice;

      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
    }

    // Additional footage
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const dbKey = formData.extraFootage === "up-to-50" ? "up_to_50" 
                   : formData.extraFootage.replace(/-/g, '_');
      
      const footageKey = `extra_footage_${dbKey}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      runningTotal += extraFootagePrice;

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

    console.log('Generated breakdown calculation:', {
      items: breakdown,
      runningTotal,
      expectedTotal: totalCost
    });

    return breakdown;
  };

  return { breakdownItems, isLoading };
}
