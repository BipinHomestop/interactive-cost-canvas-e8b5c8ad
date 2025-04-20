
import { BreakdownItem } from "@/components/calculator/payment/components/BreakdownItem";
import { BreakdownTotal } from "@/components/calculator/payment/components/BreakdownTotal";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface PriceBreakdownContainerProps {
  items: { label: string; price: number; }[];
  total: number;
}

export function PriceBreakdownContainer({ items, total }: PriceBreakdownContainerProps) {
  const { toast } = useToast();
  const [validatedTotal, setValidatedTotal] = useState(total);
  
  // Enhanced validation logic
  useEffect(() => {
    const itemsTotal = items.reduce((sum, item) => sum + item.price, 0);
    
    console.log('PriceBreakdownContainer values:', {
      items,
      itemsTotal,
      providedTotal: total,
      hasDiscrepancy: Math.abs(itemsTotal - total) > 1
    });

    // Alert if there's a significant discrepancy
    if (Math.abs(itemsTotal - total) > 1) {
      console.warn('Price discrepancy detected:', {
        itemsTotal,
        displayTotal: total
      });
      
      toast({
        title: "Price Verification",
        description: "Verifying price calculations...",
        duration: 3000,
      });
      
      // Use the items total if there's a discrepancy, as it's more accurate
      setValidatedTotal(itemsTotal);
    } else {
      setValidatedTotal(total);
    }
  }, [items, total, toast]);

  return (
    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
      <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
      <div className="space-y-2 sm:space-y-3">
        {items.map((item, index) => (
          <BreakdownItem 
            key={index} 
            label={item.label} 
            price={item.price} 
          />
        ))}
        
        <BreakdownTotal 
          total={validatedTotal}
          hasDiscrepancy={Math.abs(items.reduce((sum, item) => sum + item.price, 0) - total) > 1}
        />
      </div>
    </div>
  );
}
