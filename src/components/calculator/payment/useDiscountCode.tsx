
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

// Valid coupon codes for testing
const VALID_COUPONS: Record<string, number> = {
  "TEST99": 99.5, // 99.5% discount for testing
};

export function useDiscountCode(totalCost: number) {
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountedTotal, setDiscountedTotal] = useState<number>(totalCost);
  const { toast } = useToast();

  // Update discounted total when total cost changes
  useState(() => {
    if (discountPercentage > 0) {
      const discountAmount = totalCost * (discountPercentage / 100);
      setDiscountedTotal(totalCost - discountAmount);
    } else {
      setDiscountedTotal(totalCost);
    }
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "No coupon code entered",
        description: "Please enter a coupon code to apply",
        variant: "destructive",
      });
      return;
    }
    
    const upperCaseCode = couponCode.trim().toUpperCase();
    
    if (VALID_COUPONS[upperCaseCode]) {
      const discount = VALID_COUPONS[upperCaseCode];
      setDiscountPercentage(discount);
      
      // Calculate new total with discount
      const discountAmount = totalCost * (discount / 100);
      const newTotal = totalCost - discountAmount;
      setDiscountedTotal(newTotal);
      
      toast({
        title: "Coupon Applied",
        description: `${discount}% discount has been applied`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid",
        variant: "destructive",
      });
      setDiscountPercentage(0);
      setDiscountedTotal(totalCost);
    }
  };

  return {
    couponCode,
    setCouponCode,
    discountPercentage,
    discountedTotal,
    handleApplyCoupon
  };
}
