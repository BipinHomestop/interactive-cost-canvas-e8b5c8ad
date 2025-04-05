
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { useEffect, useState } from "react";
import { BreakdownItem as BreakdownItemType } from "@/components/calculator/types";
import { BreakdownItem } from "./components/BreakdownItem";
import { BreakdownTotal } from "./components/BreakdownTotal";
import { formatFinishLabel } from "./utils/formatUtils";

interface PriceBreakdownProps {
  formData: any;
  totalCost: number;
  discountPercentage: number;
  discountedTotal: number;
}

export function PriceBreakdown({ 
  formData, 
  totalCost, 
  discountPercentage, 
  discountedTotal 
}: PriceBreakdownProps) {
  const { getPrice, getFinishMultiplier } = usePricingConfig();
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItemType[]>([]);
  
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
  
  useEffect(() => {
    const items = renderPriceBreakdown();
    setBreakdownItems(items);
    
    // Store breakdown items for later use in checkout
    sessionStorage.setItem('cachedBreakdownItems', JSON.stringify(items));
  }, [formData, totalCost, discountPercentage]);
  
  const renderPriceBreakdown = (): BreakdownItemType[] => {
    const breakdown: BreakdownItemType[] = [];
    
    // Base price based on garage capacity
    if (formData.garageCapacity) {
      const baseKey = `base_price_${formData.garageCapacity}_car`;
      let defaultBasePrice;
      
      switch (formData.garageCapacity) {
        case 1: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR; break;
        case 2: defaultBasePrice = DEFAULT_BASE_PRICE_2_CAR; break;
        case 3: defaultBasePrice = DEFAULT_BASE_PRICE_3_CAR; break;
        case 4: defaultBasePrice = DEFAULT_BASE_PRICE_4_CAR; break;
        case 5: defaultBasePrice = DEFAULT_BASE_PRICE_5_CAR; break;
        default: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR;
      }
      
      const garageBasePrice = getPrice(baseKey, defaultBasePrice);
      
      breakdown.push({
        label: `${formData.garageCapacity}-Car Garage (Base Price)`,
        price: garageBasePrice
      });
      
      // Finish multiplier (applied to base price)
      if (formData.garageFinish) {
        const multiplier = getFinishMultiplier(formData.garageFinish);
        const finishLabel = formatFinishLabel(formData.garageFinish);
        
        if (multiplier > 1) {
          const additionalCost = Math.round(garageBasePrice * (multiplier - 1));
          
          breakdown.push({
            label: `${finishLabel} Finish (${Math.round((multiplier - 1) * 100)}% premium)`,
            price: additionalCost
          });
        }
      }
    }

    // Add stem walls cost if needed
    if (formData.needStemWalls === "yes") {
      if (formData.stemWallType === "standard") {
        const stemWallPrice = getPrice('stem_wall_standard_price', DEFAULT_STEM_WALL_STANDARD_PRICE);
        breakdown.push({
          label: `Standard Stem Walls`,
          price: stemWallPrice
        });
      } else if (formData.stemWallType === "large") {
        const stemWallPrice = getPrice('stem_wall_large_price', DEFAULT_STEM_WALL_LARGE_PRICE);
        breakdown.push({
          label: `Large Stem Walls`,
          price: stemWallPrice
        });
      }
    }

    // Add steps cost if needed
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', DEFAULT_STEPS_PRICE);
      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
    }

    // Add extra footage cost if needed
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const footageKey = `extra_footage_${formData.extraFootage.replace(/-/g, '_')}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      
      breakdown.push({
        label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
        price: extraFootagePrice
      });
    }

    // Add existing condition cost if applicable
    if (formData.currentCondition === "existing") {
      const existingPrice = getPrice('existing_condition_price', DEFAULT_EXISTING_CONDITION_PRICE);
      breakdown.push({
        label: "Existing Coating Removal",
        price: existingPrice
      });
    }

    // Add discount if applicable
    if (discountPercentage > 0) {
      const discountAmount = Math.round(totalCost * discountPercentage / 100) * -1;
      breakdown.push({
        label: `Discount (${discountPercentage}%)`,
        price: discountAmount
      });
    }

    // Verify that the sum matches the total cost (before discount)
    let calculatedTotal = 0;
    breakdown.forEach(item => {
      // Skip discount item for this calculation
      if (!item.label.includes('Discount')) {
        calculatedTotal += item.price;
      }
    });
    
    // If there's a discrepancy, add an adjustment item
    const discrepancy = totalCost - calculatedTotal;
    if (Math.abs(discrepancy) > 1) {
      console.log(`Price breakdown discrepancy detected: ${discrepancy}`);
      breakdown.push({
        label: "Price Adjustment",
        price: discrepancy
      });
    }

    return breakdown;
  };

  // Calculate total from items for verification
  const calculateTotalFromItems = (): number => {
    return breakdownItems.reduce((sum, item) => sum + item.price, 0);
  };

  // Check if the calculated total matches the expected total
  const calculatedTotal = calculateTotalFromItems();
  const expectedTotal = discountPercentage > 0 ? discountedTotal : totalCost;
  const hasDiscrepancy = Math.abs(calculatedTotal - expectedTotal) > 1;

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
      <div className="space-y-2 sm:space-y-3">
        {breakdownItems.map((item, index) => (
          <BreakdownItem 
            key={index} 
            label={item.label} 
            price={item.price} 
          />
        ))}
        
        <BreakdownTotal 
          total={discountPercentage > 0 ? discountedTotal : totalCost}
          hasDiscrepancy={hasDiscrepancy}
        />
      </div>
    </div>
  );
}
