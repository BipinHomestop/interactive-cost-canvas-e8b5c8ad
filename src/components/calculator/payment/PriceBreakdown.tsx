
import { usePriceBreakdown } from "./hooks/usePriceBreakdown";
import { PriceBreakdownContainer } from "./components/PriceBreakdownContainer";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";

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
  const { breakdownItems, isLoading } = usePriceBreakdown({
    formData,
    totalCost,
    discountPercentage
  });
  
  const [calculatedTotal, setCalculatedTotal] = useState(totalCost);
  const [finalTotal, setFinalTotal] = useState(discountedTotal || totalCost);

  useEffect(() => {
    // Try to get cached breakdown first
    const cachedItems = sessionStorage.getItem('cachedBreakdownItems');
    if (cachedItems) {
      try {
        const items = JSON.parse(cachedItems);
        const breakdownSum = items.reduce((sum: number, item: any) => sum + item.price, 0);
        setCalculatedTotal(breakdownSum);
        
        const newFinalTotal = discountPercentage > 0 ? 
          Math.round(breakdownSum * (1 - discountPercentage / 100)) : 
          breakdownSum;
          
        setFinalTotal(newFinalTotal);
        return;
      } catch (error) {
        console.error('Error parsing cached breakdown items:', error);
      }
    }
    
    // If no cache or error, calculate from current items
    const breakdownSum = breakdownItems.reduce((sum, item) => sum + item.price, 0);
    setCalculatedTotal(breakdownSum);
    
    const newFinalTotal = discountPercentage > 0 ? 
      Math.round(breakdownSum * (1 - discountPercentage / 100)) : 
      breakdownSum;
      
    setFinalTotal(newFinalTotal);
    
    // Update cache
    sessionStorage.setItem('cachedBreakdownItems', JSON.stringify(breakdownItems));
    
    console.log('Price breakdown validation:', {
      breakdownSum,
      providedTotal: totalCost,
      discountedTotal,
      calculatedFinalTotal: newFinalTotal,
      items: breakdownItems,
      formData
    });
  }, [breakdownItems, totalCost, discountPercentage, discountedTotal, formData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PriceBreakdownContainer 
      items={breakdownItems}
      total={finalTotal}
    />
  );
}
