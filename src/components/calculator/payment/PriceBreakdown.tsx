
import { usePriceBreakdown } from "./hooks/usePriceBreakdown";
import { PriceBreakdownContainer } from "./components/PriceBreakdownContainer";
import { useEffect } from "react";
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

  useEffect(() => {
    // Validate total matches breakdown sum
    const breakdownSum = breakdownItems.reduce((sum, item) => sum + item.price, 0);
    console.log('Price breakdown validation:', {
      breakdownSum,
      providedTotal: totalCost,
      discountedTotal,
      items: breakdownItems,
      formData
    });
  }, [breakdownItems, totalCost, discountedTotal, formData]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate the actual total from breakdown items
  const calculatedTotal = breakdownItems.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = discountPercentage > 0 ? 
    Math.round(calculatedTotal * (1 - discountPercentage / 100)) : 
    calculatedTotal;

  return (
    <PriceBreakdownContainer 
      items={breakdownItems}
      total={finalTotal}
    />
  );
}
