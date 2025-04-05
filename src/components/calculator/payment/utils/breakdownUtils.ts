
import { BreakdownItem } from "@/components/calculator/types";
import { formatFinishLabel } from "./formatUtils";

/**
 * Generate price breakdown items for checkout
 */
export const getBreakdownItems = (
  formData: any, 
  totalCost: number, 
  discountPercentage: number
): BreakdownItem[] => {
  // Generate fresh breakdown items each time - don't rely on cached values
  const basePrice = formData.garageCapacity === 1 ? 1000 : 
                    formData.garageCapacity === 2 ? 2000 : 
                    formData.garageCapacity === 3 ? 3500 : 
                    formData.garageCapacity === 4 ? 4000 : 5000;
                    
  const finishMultiplier = formData.garageFinish === 'snowfall' ? 1.2 :
                          formData.garageFinish === 'carbon' ? 1.1 : 
                          formData.garageFinish === 'cabin_fever' ? 1.15 :
                          formData.garageFinish === 'creekbed' ? 1.2 :
                          formData.garageFinish === 'nightfall' ? 1.3 :
                          formData.garageFinish === 'orbit' ? 1.35 :
                          formData.garageFinish === 'outback' ? 1.4 :
                          formData.garageFinish === 'pecan' ? 1.45 :
                          formData.garageFinish === 'shoreline' ? 1.5 :
                          formData.garageFinish === 'tidal_wave' ? 1.55 :
                          formData.garageFinish === 'wombat' ? 1.6 :
                          formData.garageFinish === 'domino' ? 2 : 1.2;
                          
  const items: BreakdownItem[] = [
    {
      label: `${formData.garageCapacity}-Car Garage Base Price`,
      price: basePrice,
    },
    {
      label: `${formatFinishLabel(formData.garageFinish)} Finish`,
      price: (basePrice * finishMultiplier) - basePrice,
    }
  ];
  
  // Add optional items
  if (formData.needStemWalls === 'yes' && formData.stemWallType) {
    const stemWallPrice = formData.stemWallType === 'standard' ? 500 : 1000;
    items.push({
      label: `${formData.stemWallType.charAt(0).toUpperCase() + formData.stemWallType.slice(1)} Stem Walls`,
      price: stemWallPrice,
    });
  }
  
  if (formData.needSteps === 'yes') {
    items.push({
      label: 'House Steps',
      price: 300,
    });
  }
  
  if (formData.needExtraFootage === 'yes' && formData.extraFootage) {
    const extraFootagePrice = 
      formData.extraFootage === 'up-to-50' ? 200 :
      formData.extraFootage === '51-100' ? 400 :
      formData.extraFootage === '101-150' ? 600 : 800;
    
    items.push({
      label: 'Additional Square Footage',
      price: extraFootagePrice,
    });
  }
  
  if (formData.currentCondition === 'existing') {
    items.push({
      label: 'Existing Condition Fee',
      price: 200,
    });
  }
  
  // Add discount if applicable
  if (discountPercentage > 0) {
    const discountAmount = (totalCost * (discountPercentage / 100)) * -1;
    items.push({
      label: `Discount (${discountPercentage}%)`,
      price: discountAmount,
    });
  }
  
  // Store the fresh breakdown items for checkout
  sessionStorage.setItem('cachedBreakdownItems', JSON.stringify(items));
  
  return items;
};
