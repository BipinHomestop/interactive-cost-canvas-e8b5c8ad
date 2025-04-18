
import { BreakdownItem } from "@/components/calculator/types";
import { formatFinishLabel } from "./formatUtils";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";

/**
 * Generate price breakdown items for checkout
 */
export const getBreakdownItems = (
  formData: any, 
  totalCost: number, 
  discountPercentage: number
): BreakdownItem[] => {
  // Initialize items array
  const items: BreakdownItem[] = [];
  
  // Base price for garage capacity
  const basePrice = totalCost;
  items.push({
    label: `${formData.garageCapacity}-Car Garage Base Price`,
    price: basePrice,
  });
  
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
