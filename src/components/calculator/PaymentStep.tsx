
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep({ onBack, formData, totalCost }: PaymentStepProps) {
  const [date, setDate] = useState<Date>();
  const isMobile = useIsMobile();

  const renderPriceBreakdown = () => {
    const breakdown = [];
    
    // Base price based on garage capacity
    breakdown.push({
      label: `${formData.garageCapacity} Car Garage`,
      price: formData.garageCapacity * 1000
    });

    // Finish multiplier
    if (formData.garageFinish === "snowfall") {
      breakdown.push({
        label: "Snowfall Finish (20% premium)",
        price: (formData.garageCapacity * 1000) * 0.2
      });
    }

    // Stem walls
    if (formData.needStemWalls === "yes") {
      breakdown.push({
        label: `${formData.stemWallType} Stem Walls`,
        price: formData.stemWallType === "standard" ? 500 : 1000
      });
    }

    // Steps
    if (formData.needSteps === "yes") {
      breakdown.push({
        label: "House Steps",
        price: 300
      });
    }

    // Extra footage
    if (formData.needExtraFootage === "yes" && formData.extraFootage) {
      const footageCosts = {
        "up-to-50": 200,
        "51-100": 400,
        "101-150": 600,
        "151-200": 800,
      };
      breakdown.push({
        label: `Additional Footage (${formData.extraFootage})`,
        price: footageCosts[formData.extraFootage]
      });
    }

    // Current condition
    if (formData.currentCondition === "existing") {
      breakdown.push({
        label: "Existing Coating Removal",
        price: 200
      });
    }

    return breakdown;
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 overflow-y-auto pb-24 sm:pb-28">
        <div className="space-y-5 sm:space-y-6 px-1 sm:px-2">
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-base sm:text-lg mb-3">Price Breakdown</h3>
            <div className="space-y-2 sm:space-y-3">
              {renderPriceBreakdown().map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-base sm:text-lg">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Choose Installation Date</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-10 sm:h-12",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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

          <div className="space-y-2 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg mb-2">Choose how to pay the deposit</h3>
            <RadioGroup defaultValue="credit" className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 border rounded-lg p-3 sm:p-4 hover:border-[#1A3174] transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <RadioGroupItem 
                    value="credit" 
                    id="credit"
                    className="border-[#1A3174] text-[#1A3174] [&[data-state=checked]]:bg-[#1A3174] [&[data-state=checked]]:text-white"
                  />
                  <Label htmlFor="credit" className="font-medium text-sm">
                    Pay $100.00 deposit with credit or debit card
                  </Label>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3 sm:p-4 hover:border-[#1A3174] transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  <RadioGroupItem 
                    value="paypal" 
                    id="paypal"
                    className="border-[#1A3174] text-[#1A3174] [&[data-state=checked]]:bg-[#1A3174] [&[data-state=checked]]:text-white"
                  />
                  <Label htmlFor="paypal" className="font-medium text-sm">
                    Pay $100.00 deposit with PayPal
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex space-x-2">
              <Input placeholder="Enter coupon code" className="h-10 flex-1 text-sm" />
              <Button variant="default" className="bg-[#1A3174] h-10 px-3 sm:px-6 text-sm">Apply</Button>
            </div>
            <p className="text-gray-500 text-xs">No coupon applied</p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <Input placeholder="Card number" className="h-10 text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <Input placeholder="MM" className="h-10 text-sm" />
              <Input placeholder="YY" className="h-10 text-sm" />
              <Input placeholder="CVV" className="h-10 text-sm" />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 sm:p-6 border-t z-10">
        <div className="flex gap-3 sm:gap-4 max-w-screen-xl mx-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-10 sm:h-12 rounded-lg bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5 text-sm"
          >
            Back
          </Button>
          <Button 
            className="flex-1 h-10 sm:h-12 rounded-lg bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm"
          >
            Complete your order
          </Button>
        </div>
      </div>
    </div>
  );
}
