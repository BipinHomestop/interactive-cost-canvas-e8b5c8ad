
import { BreakdownItem } from "@/components/calculator/payment/components/BreakdownItem";
import { BreakdownTotal } from "@/components/calculator/payment/components/BreakdownTotal";
import { useEffect } from "react";

interface PriceBreakdownContainerProps {
  items: { label: string; price: number; }[];
  total: number;
}

export function PriceBreakdownContainer({ items, total }: PriceBreakdownContainerProps) {
  // Debug log to check the items and total
  useEffect(() => {
    console.log('PriceBreakdownContainer values:', {
      items,
      total,
      itemsTotal: items.reduce((sum, item) => sum + item.price, 0)
    });
  }, [items, total]);

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
          total={total}
          hasDiscrepancy={false}
        />
      </div>
    </div>
  );
}
