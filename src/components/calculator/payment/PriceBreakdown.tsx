
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
  
  useEffect(() => {
    const items = renderPriceBreakdown();
    setBreakdownItems(items);
    console.log('Generated breakdown items:', items);
  }, [formData, totalCost, discountPercentage]);
  
  const renderPriceBreakdown = (): BreakdownItemType[] => {
    const breakdown: BreakdownItemType[] = [];
    let runningTotal = 0;
    
    // Base price based on garage capacity
    if (formData.garageCapacity) {
      const baseKey = `base_price_${formData.garageCapacity}_car`;
      const garageBasePrice = getPrice(baseKey, 0);
      runningTotal += garageBasePrice;
      
      breakdown.push({
        label: `${formData.garageCapacity}-Car Garage (Base Price)`,
        price: garageBasePrice
      });
      
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
        }
      }
    }

    // Add stem walls cost if needed
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

    // Add steps cost if needed
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', 0);
      runningTotal += stepsPrice;
      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
    }

    // Add extra footage cost if needed
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const footageKey = `extra_footage_${formData.extraFootage.replace(/-/g, '_')}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      runningTotal += extraFootagePrice;
      
      breakdown.push({
        label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
        price: extraFootagePrice
      });
    }

    // Add existing condition cost if applicable
    if (formData.currentCondition === "existing") {
      const existingPrice = getPrice('existing_condition_price', 0);
      runningTotal += existingPrice;
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

    return breakdown;
  };

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
          hasDiscrepancy={false}
        />
      </div>
    </div>
  );
}
