import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";

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
  const isMobile = useIsMobile();
  const { getPrice, getFinishMultiplier, isLoading } = usePricingConfig();
  
  // Default fallback values in case database fetch fails
  const DEFAULT_BASE_PRICE = 1000;
  const DEFAULT_STEM_WALL_STANDARD_PRICE = 500;
  const DEFAULT_STEM_WALL_LARGE_PRICE = 1000;
  const DEFAULT_STEPS_PRICE = 300;
  const DEFAULT_EXISTING_CONDITION_PRICE = 200;

  const renderPriceBreakdown = () => {
    const breakdown = [];
    
    // Base price based on garage capacity
    const basePrice = getPrice('base_price_per_car', DEFAULT_BASE_PRICE);
    const garageBasePrice = formData.garageCapacity * basePrice;
    breakdown.push({
      label: `${formData.garageCapacity} Car Garage (Base Price)`,
      price: garageBasePrice
    });

    // Finish multiplier
    if (formData.garageFinish) {
      const multiplier = getFinishMultiplier(formData.garageFinish);
      const finishLabel = formatFinishLabel(formData.garageFinish);
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
        label: `Additional Footage (${formData.extraFootage})`,
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

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-16' : 'h-[calc(100vh-80px)]'}`}>
      <div className={`${isMobile ? 'space-y-5' : 'space-y-6'} px-4 sm:px-6 pb-8`}>
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Price Breakdown</h3>
          <div className="space-y-2 sm:space-y-3">
            {renderPriceBreakdown().map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-lg">Choose Installation Date</h3>
          <Popover>
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
                onSelect={setDate}
                initialFocus
                disabled={(date) => date < new Date()}
                className="[&_.rdp-day:hover:not([disabled])]:bg-[#1A3174]/90 [&_.rdp-day:hover:not([disabled])]:text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <h3 className="font-semibold text-lg mb-3">Choose how to pay the deposit</h3>
          <RadioGroup defaultValue="credit" className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2 border rounded-lg p-3 sm:p-5 hover:border-[#1A3174] transition-colors">
              <div className="flex items-center space-x-3 flex-1">
                <RadioGroupItem 
                  value="credit" 
                  id="credit"
                  className="border-[#1A3174] text-[#1A3174] [&[data-state=checked]]:bg-[#1A3174] [&[data-state=checked]]:text-white"
                />
                <Label htmlFor="credit" className="font-medium text-sm sm:text-base">
                  Pay $100.00 deposit with credit or debit card
                </Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-lg p-3 sm:p-5 hover:border-[#1A3174] transition-colors">
              <div className="flex items-center space-x-3 flex-1">
                <RadioGroupItem 
                  value="paypal" 
                  id="paypal"
                  className="border-[#1A3174] text-[#1A3174] [&[data-state=checked]]:bg-[#1A3174] [&[data-state=checked]]:text-white"
                />
                <Label htmlFor="paypal" className="font-medium text-sm sm:text-base">
                  Pay $100.00 deposit with PayPal
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex space-x-2">
            <Input placeholder="Enter coupon code" className="h-12 sm:h-14 flex-1 text-sm" />
            <Button variant="default" className="bg-[#1A3174] h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-base">Apply</Button>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">No coupon applied</p>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-4">
          <Input placeholder="Card number" className="h-12 sm:h-14 text-sm" />
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Input placeholder="MM" className="h-12 sm:h-14 text-sm" />
            <Input placeholder="YY" className="h-12 sm:h-14 text-sm" />
            <Input placeholder="CVV" className="h-12 sm:h-14 text-sm" />
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-50 border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1 h-12 rounded-full bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5 text-sm"
            >
              Back
            </Button>
            <Button 
              className="flex-1 h-12 rounded-full bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm"
            >
              Complete
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
            >
              Back
            </Button>
            <Button 
              className="flex-1 h-12 sm:h-14 rounded-lg bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm sm:text-base"
            >
              Complete your order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
