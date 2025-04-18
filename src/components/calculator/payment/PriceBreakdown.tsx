
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
    console.log('PriceBreakdown received props:', {
      formData,
      totalCost,
      discountPercentage,
      discountedTotal,
      breakdownItems,
      isLoading
    });
  }, [formData, totalCost, discountPercentage, discountedTotal, breakdownItems, isLoading]);

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
      total={discountPercentage > 0 ? discountedTotal : totalCost}
    />
  );
}
