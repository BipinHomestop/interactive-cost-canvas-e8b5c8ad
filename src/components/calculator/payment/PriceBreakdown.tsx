
import { usePriceBreakdown } from "./hooks/usePriceBreakdown";
import { PriceBreakdownContainer } from "./components/PriceBreakdownContainer";
import { useEffect } from "react";

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
  const { breakdownItems } = usePriceBreakdown({
    formData,
    totalCost,
    discountPercentage
  });

  // Debug log to track what's being passed and calculated
  useEffect(() => {
    console.log('PriceBreakdown props:', {
      formData,
      totalCost,
      discountPercentage,
      discountedTotal,
      breakdownItems
    });
  }, [formData, totalCost, discountPercentage, discountedTotal, breakdownItems]);

  return (
    <PriceBreakdownContainer 
      items={breakdownItems}
      total={discountPercentage > 0 ? discountedTotal : totalCost}
    />
  );
}
