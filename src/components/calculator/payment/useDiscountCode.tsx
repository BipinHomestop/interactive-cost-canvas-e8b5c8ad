
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define interface for discount code data
interface DiscountCode {
  id: string;
  code: string;
  discount_percentage: number;
  active: boolean;
  created_at: string;
  expires_at: string | null;
}

export function useDiscountCode(totalCost: number) {
  const [couponCode, setCouponCode] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Calculate discounted total
  const discountedTotal = Math.round(totalCost * (1 - discountPercentage / 100));
  
  // Function to initialize discount state (used when restoring from cache)
  const setInitialDiscount = useCallback((percentage: number, code: string) => {
    setDiscountPercentage(percentage);
    setCouponCode(code);
    
    // Store in session storage for persistence
    sessionStorage.setItem('cachedDiscountPercentage', percentage.toString());
    sessionStorage.setItem('cachedCouponCode', code);
  }, []);
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter a coupon code",
        description: "Please enter a valid coupon code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use secured edge function instead of direct RPC
      const { data, error } = await supabase.functions.invoke('validate-discount', {
        body: { code: couponCode.trim().toUpperCase() }
      });

      if (error) {
        console.error('Error validating coupon');
        toast({
          title: "Error",
          description: "Failed to validate coupon. Please try again.",
          variant: "destructive",
        });
        setDiscountPercentage(0);
        return;
      }

      const validationResult = data;
      
      
      if (!validationResult || !validationResult.is_valid) {
        toast({
          title: "Invalid Coupon",
          description: "This coupon code is invalid or expired",
          variant: "destructive",
        });
        setDiscountPercentage(0);
        sessionStorage.removeItem('cachedDiscountPercentage');
        sessionStorage.removeItem('cachedCouponCode');
        return;
      }
      
      // Apply the discount
      const discountValue = validationResult.discount_percentage;
      setDiscountPercentage(discountValue);
      
      // Save to session storage
      sessionStorage.setItem('cachedDiscountPercentage', discountValue.toString());
      sessionStorage.setItem('cachedCouponCode', couponCode);
      
      toast({
        title: "Coupon Applied",
        description: `${discountValue}% discount applied to your order`,
        className: "bg-green-500 text-white border-none",
      });
      
    } catch (error) {
      console.error('Error applying coupon');
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    couponCode,
    setCouponCode,
    discountPercentage,
    discountedTotal,
    isLoading,
    handleApplyCoupon,
    setInitialDiscount
  };
}
