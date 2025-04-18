
import { usePriceBreakdown } from "./hooks/usePriceBreakdown";
import { PriceBreakdownContainer } from "./components/PriceBreakdownContainer";

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

  return (
    <PriceBreakdownContainer 
      items={breakdownItems}
      total={discountPercentage > 0 ? discountedTotal : totalCost}
    />
  );
}
