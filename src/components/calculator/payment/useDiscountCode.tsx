
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
      // Query the discount_codes table with explicit type declaration
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .maybeSingle();
      
      if (error || !data) {
        console.error('Error fetching coupon:', error);
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
      
      // Type check and process discount
      const discountData = data as DiscountCode;
      
      // Check if the coupon has expired
      if (discountData.expires_at && new Date(discountData.expires_at) < new Date()) {
        toast({
          title: "Expired Coupon",
          description: "This coupon code has expired",
          variant: "destructive",
        });
        setDiscountPercentage(0);
        return;
      }
      
      // Apply the discount
      setDiscountPercentage(discountData.discount_percentage);
      
      // Save to session storage
      sessionStorage.setItem('cachedDiscountPercentage', discountData.discount_percentage.toString());
      sessionStorage.setItem('cachedCouponCode', couponCode);
      
      toast({
        title: "Coupon Applied",
        description: `${discountData.discount_percentage}% discount applied to your order`,
        className: "bg-green-500 text-white border-none",
      });
      
    } catch (error) {
      console.error('Error applying coupon:', error);
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
