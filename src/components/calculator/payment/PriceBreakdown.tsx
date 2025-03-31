
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";

// Helper function to format finish labels
const formatFinishLabel = (finish: string): string => {
  return finish
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Type for breakdown items
export type BreakdownItem = {
  label: string;
  price: number;
};

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

  const renderPriceBreakdown = (): BreakdownItem[] => {
    const breakdown = [];
    
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
    }

    // Finish multiplier
    if (formData.garageFinish) {
      const multiplier = getFinishMultiplier(formData.garageFinish);
      const finishLabel = formatFinishLabel(formData.garageFinish);
      
      // Get base price
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
      const additionalCost = garageBasePrice * (multiplier - 1);
      
      breakdown.push({
        label: `${finishLabel} Finish (${Math.round((multiplier - 1) * 100)}% premium)`,
        price: additionalCost
      });
    }

    // Stem walls
    if (formData.needStemWalls === "yes") {
      const stemWallPrice = formData.stemWallType === "standard" 
        ? getPrice('stem_wall_standard_price', DEFAULT_STEM_WALL_STANDARD_PRICE)
        : getPrice('stem_wall_large_price', DEFAULT_STEM_WALL_LARGE_PRICE);
      
      breakdown.push({
        label: `${formData.stemWallType === "standard" ? "Standard" : "Large"} Stem Walls`,
        price: stemWallPrice
      });
    }

    // Steps
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', DEFAULT_STEPS_PRICE);
      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
    }

    // Extra footage
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const footageKey = `extra_footage_${formData.extraFootage.replace(/-/g, '_')}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      
      breakdown.push({
        label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
        price: extraFootagePrice
      });
    }

    // Current condition
    if (formData.currentCondition === "existing") {
      const existingPrice = getPrice('existing_condition_price', DEFAULT_EXISTING_CONDITION_PRICE);
      breakdown.push({
        label: "Existing Coating Removal",
        price: existingPrice
      });
    }

    return breakdown;
  };

  const breakdownItems = renderPriceBreakdown();

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
      <div className="space-y-2 sm:space-y-3">
        {breakdownItems.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{item.label}</span>
            <span className="font-medium">${item.price.toFixed(2)}</span>
          </div>
        ))}
        
        {discountPercentage > 0 && (
          <div className="flex justify-between text-sm text-red-600">
            <span>Discount ({discountPercentage}%)</span>
            <span>-${(totalCost * discountPercentage / 100).toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${discountPercentage > 0 ? discountedTotal.toFixed(2) : totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
