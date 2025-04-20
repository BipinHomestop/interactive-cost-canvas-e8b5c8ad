
import { useState, useEffect } from "react";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { BreakdownItem } from "@/components/calculator/types";
import { generateBreakdownItems } from "../utils/generateBreakdownItems";
import { getBreakdownFromCache, saveBreakdownToCache } from "../utils/breakdownCache";

interface UsePriceBreakdownProps {
  formData: any;
  totalCost: number;
  discountPercentage: number;
  step?: number;
}

export function usePriceBreakdown({ 
  formData, 
  totalCost, 
  discountPercentage,
  step = 0
}: UsePriceBreakdownProps) {
  const { getPrice, getFinishMultiplier, isLoading } = usePricingConfig();
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);

  useEffect(() => {
    if (isLoading) {
      console.log('Waiting for pricing config to load...');
      return;
    }

    // Try to get cached items in step 9
    if (step === 9) {
      const cachedItems = getBreakdownFromCache();
      if (cachedItems) {
        console.log('Using cached breakdown items');
        setBreakdownItems(cachedItems);
        return;
      }
    }

    // Generate new breakdown items
    console.log('Generating new breakdown items');
    const items = generateBreakdownItems({
      formData,
      totalCost,
      discountPercentage,
      getPrice,
      getFinishMultiplier
    });

    setBreakdownItems(items);
    
    // Cache items if in step 9
    if (step === 9) {
      saveBreakdownToCache(items);
    }
  }, [formData, totalCost, discountPercentage, isLoading, step, getPrice, getFinishMultiplier]);

  return { breakdownItems, isLoading };
}
