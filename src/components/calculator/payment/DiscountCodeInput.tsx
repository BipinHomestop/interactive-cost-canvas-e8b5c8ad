
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface DiscountCodeInputProps {
  couponCode: string;
  setCouponCode: (code: string) => void;
  discountPercentage: number;
  onApplyCoupon: () => void;
}

export function DiscountCodeInput({ 
  couponCode, 
  setCouponCode, 
  discountPercentage, 
  onApplyCoupon 
}: DiscountCodeInputProps) {
  const { toast } = useToast();
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Empty code",
        description: "Please enter a discount code first",
        variant: "destructive"
      });
      return;
    }
    
    onApplyCoupon();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplyCoupon();
    }
  };
  
  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="font-semibold text-lg">Discount Code</h3>
      <div className="flex space-x-2">
        <Input 
          placeholder="Enter coupon code" 
          className="h-12 sm:h-14 flex-1 text-sm" 
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button 
          variant="default" 
          className="bg-[#1A3174] h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-base"
          onClick={handleApplyCoupon}
        >
          Apply
        </Button>
      </div>
      <p className="text-gray-500 text-xs sm:text-sm">
        {discountPercentage > 0 
          ? `Coupon applied: ${discountPercentage}% discount` 
          : "Enter a coupon code if you have one"}
      </p>
    </div>
  );
}
