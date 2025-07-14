
import { useConsolidatedPriceBreakdown } from "@/hooks/calculator/use-consolidated-price-breakdown";
import { PriceBreakdownContainer } from "./components/PriceBreakdownContainer";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { BreakdownItem } from "../types";
import { useToast } from "@/components/ui/use-toast";

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
  const { breakdownItems, isLoading } = useConsolidatedPriceBreakdown({
    formData,
    totalCost,
    discountPercentage
  });
  
  const [calculatedTotal, setCalculatedTotal] = useState(totalCost);
  const [finalTotal, setFinalTotal] = useState(discountedTotal || totalCost);
  const [displayItems, setDisplayItems] = useState<BreakdownItem[]>([]);
  const { toast } = useToast();

  // Use effect to process breakdown items and update final total
  useEffect(() => {
    if (breakdownItems.length === 0) {
      console.log('No breakdown items available yet');
      return;
    }

    // Update display items
    setDisplayItems(breakdownItems);
    
    // Validate total matches breakdown sum
    const breakdownSum = breakdownItems.reduce((sum, item) => sum + item.price, 0);
    console.log('Breakdown validation in PriceBreakdown:', {
      items: breakdownItems.length,
      breakdownSum,
      totalCost
    });
    
    setCalculatedTotal(breakdownSum);
    
    // Calculate final total including discount
    const newFinalTotal = discountPercentage > 0 ? 
      Math.round(breakdownSum * (1 - discountPercentage / 100)) : 
      breakdownSum;
      
    setFinalTotal(newFinalTotal);
    
    // Removed session storage caching to prevent calculation issues
  }, [breakdownItems, totalCost, discountPercentage, discountedTotal, formData, toast]);

  // Show loading state while items are being calculated
  if (isLoading || displayItems.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PriceBreakdownContainer 
      items={displayItems}
      total={finalTotal}
    />
  );
}
