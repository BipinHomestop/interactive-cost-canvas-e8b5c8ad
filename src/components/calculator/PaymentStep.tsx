
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formatFinishLabel = (finish: string): string => {
  return finish
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep({ onBack, formData, totalCost }: PaymentStepProps) {
  const [date, setDate] = useState<Date>();
  const [couponCode, setCouponCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountedTotal, setDiscountedTotal] = useState<number>(totalCost);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { getPrice, getFinishMultiplier } = usePricingConfig();
  
  // Valid coupon codes for testing
  const VALID_COUPONS = {
    "TEST99": 99.5, // 99.5% discount for testing
  };
  
  // Default fallback values in case database fetch fails
  const DEFAULT_BASE_PRICE_1_CAR = 1000;
  const DEFAULT_BASE_PRICE_2_CAR = 2200;
  const DEFAULT_BASE_PRICE_3_CAR = 3500;
  const DEFAULT_BASE_PRICE_4_CAR = 5000;
  const DEFAULT_BASE_PRICE_5_CAR = 6500;
  const DEFAULT_STEM_WALL_STANDARD_PRICE = 500;
  const DEFAULT_STEM_WALL_LARGE_PRICE = 1000;
  const DEFAULT_STEPS_PRICE = 300;
  const DEFAULT_EXISTING_CONDITION_PRICE = 200;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsCalendarOpen(false); // Close the calendar popover after selection
  };

  const renderPriceBreakdown = () => {
    const breakdown = [];
    
    // Base price based on garage capacity
    if (formData.garageCapacity) {
      const baseKey = `base_price_${formData.garageCapacity}_car`;
      let defaultBasePrice;
      
      switch (formData.garageCapacity) {
        case 1: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR; break;
        case 2: defaultBasePrice = DEFAULT_BASE_PRICE_2_CAR; break;
        case 3: defaultBasePrice = DEFAULT_BASE_PRICE_3_CAR; break;
        case 4: defaultBasePrice = DEFAULT_BASE_PRICE_4_CAR; break;
        case 5: defaultBasePrice = DEFAULT_BASE_PRICE_5_CAR; break;
        default: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR;
      }
      
      const garageBasePrice = getPrice(baseKey, defaultBasePrice);
      
      breakdown.push({
        label: `${formData.garageCapacity}-Car Garage (Base Price)`,
        price: garageBasePrice
      });
    }

    // Finish multiplier
    if (formData.garageFinish) {
      const multiplier = getFinishMultiplier(formData.garageFinish);
      const finishLabel = formatFinishLabel(formData.garageFinish);
      
      // Get base price
      const baseKey = `base_price_${formData.garageCapacity}_car`;
      let defaultBasePrice;
      
      switch (formData.garageCapacity) {
        case 1: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR; break;
        case 2: defaultBasePrice = DEFAULT_BASE_PRICE_2_CAR; break;
        case 3: defaultBasePrice = DEFAULT_BASE_PRICE_3_CAR; break;
        case 4: defaultBasePrice = DEFAULT_BASE_PRICE_4_CAR; break;
        case 5: defaultBasePrice = DEFAULT_BASE_PRICE_5_CAR; break;
        default: defaultBasePrice = DEFAULT_BASE_PRICE_1_CAR;
      }
      
      const garageBasePrice = getPrice(baseKey, defaultBasePrice);
      const additionalCost = garageBasePrice * (multiplier - 1);
      
      breakdown.push({
        label: `${finishLabel} Finish (${Math.round((multiplier - 1) * 100)}% premium)`,
        price: additionalCost
      });
    }

    // Stem walls
    if (formData.needStemWalls === "yes") {
      const stemWallPrice = formData.stemWallType === "standard" 
        ? getPrice('stem_wall_standard_price', DEFAULT_STEM_WALL_STANDARD_PRICE)
        : getPrice('stem_wall_large_price', DEFAULT_STEM_WALL_LARGE_PRICE);
      
      breakdown.push({
        label: `${formData.stemWallType === "standard" ? "Standard" : "Large"} Stem Walls`,
        price: stemWallPrice
      });
    }

    // Steps
    if (formData.needSteps === "yes") {
      const stepsPrice = getPrice('steps_price', DEFAULT_STEPS_PRICE);
      breakdown.push({
        label: "House Steps",
        price: stepsPrice
      });
    }

    // Extra footage
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const footageKey = `extra_footage_${formData.extraFootage.replace(/-/g, '_')}`;
      const extraFootagePrice = getPrice(footageKey, 0);
      
      breakdown.push({
        label: `Additional Footage (${formData.extraFootage.replace(/-/g, ' to ')})`,
        price: extraFootagePrice
      });
    }

    // Current condition
    if (formData.currentCondition === "existing") {
      const existingPrice = getPrice('existing_condition_price', DEFAULT_EXISTING_CONDITION_PRICE);
      breakdown.push({
        label: "Existing Coating Removal",
        price: existingPrice
      });
    }

    return breakdown;
  };

  const handleApplyCoupon = () => {
    setErrorMessage("");
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

  const handleCheckout = async () => {
    if (!date) {
      toast({
        title: "Select installation date",
        description: "Please select your preferred installation date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Prepare line items for Stripe based on price breakdown
      const lineItems = renderPriceBreakdown().map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.label,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: 1,
      }));

      console.log("Line items for checkout:", lineItems);

      // Metadata to include with the Stripe checkout session
      const metadata = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        installation_date: date ? format(date, "yyyy-MM-dd") : '',
        garage_capacity: formData.garageCapacity,
        garage_finish: formData.garageFinish,
        coupon_code: couponCode || 'none',
        discount_percentage: discountPercentage.toString(),
      };

      console.log("Metadata for checkout:", metadata);

      // Create the checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          lineItems: lineItems,
          totalAmount: discountPercentage > 0 ? discountedTotal : totalCost,
          metadata: metadata,
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/?step=9', // Return to payment step
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      console.log("Checkout session response:", data);

      if (data && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        setErrorMessage('No checkout URL returned from payment provider. Please try again later.');
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setErrorMessage(`Payment error: ${error.message || 'Unknown error occurred'}`);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-16' : 'h-[calc(100vh-80px)]'}`}>
      <div className={`${isMobile ? 'space-y-5' : 'space-y-6'} px-4 sm:px-6 pb-8`}>
        {errorMessage && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
          <div className="space-y-2 sm:space-y-3">
            {renderPriceBreakdown().map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
            
            {discountPercentage > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Discount ({discountPercentage}%)</span>
                <span>-${(totalCost * discountPercentage / 100).toFixed(2)}</span>
              </div>
            )}
            
            <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${discountPercentage > 0 ? discountedTotal.toFixed(2) : totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-lg">Choose Installation Date</h3>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-12 sm:h-14",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0", isMobile && "w-[calc(100vw-32px)]")}>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
                disabled={(date) => date < new Date()}
                className="[&_.rdp-day:hover:not([disabled])]:bg-[#1A3174]/90 [&_.rdp-day:hover:not([disabled])]:text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-lg">Discount Code</h3>
          <div className="flex space-x-2">
            <Input 
              placeholder="Enter coupon code" 
              className="h-12 sm:h-14 flex-1 text-sm" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />
            <Button 
              variant="default" 
              className="bg-[#1A3174] h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-base"
              onClick={handleApplyCoupon}
              disabled={isLoading}
            >
              Apply
            </Button>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">
            {discountPercentage > 0 
              ? `Coupon applied: ${discountPercentage}% discount` 
              : "No coupon applied"}
          </p>
        </div>
      </div>

      {isMobile ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-50 border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1 h-12 rounded-full bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5 text-sm"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              className="flex-1 h-12 rounded-full bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 sm:p-6 border-t mt-auto">
          <div className="flex gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1 h-12 sm:h-14 rounded-lg bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5 text-sm sm:text-base"
              disabled={isLoading}
            >
              Back
            </Button>
            <Button 
              className="flex-1 h-12 sm:h-14 rounded-lg bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm sm:text-base"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete your order"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
