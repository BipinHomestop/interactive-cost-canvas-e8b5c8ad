
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
    // Validate total matches breakdown sum
    const breakdownSum = breakdownItems.reduce((sum, item) => sum + item.price, 0);
    
    setCalculatedTotal(breakdownSum);
    
    // Calculate final total including discount
    const newFinalTotal = discountPercentage > 0 ? 
      Math.round(breakdownSum * (1 - discountPercentage / 100)) : 
      breakdownSum;
      
    setFinalTotal(newFinalTotal);
    
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
