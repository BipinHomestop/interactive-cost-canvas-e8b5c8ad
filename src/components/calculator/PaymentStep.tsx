
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

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep({ onBack, formData, totalCost }: PaymentStepProps) {
  const [date, setDate] = useState<Date>();

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
    <div className="flex flex-col h-full max-h-[calc(100vh-200px)]">
      <ScrollArea className="flex-1">
        <div className="space-y-6 px-4 pb-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4">Price Breakdown</h3>
            <div className="space-y-2">
              {renderPriceBreakdown().map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Choose Installation Date</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal hover:border-[#1A3174] hover:text-[#1A3174]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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

          <div>
            <h3 className="font-semibold mb-4">Choose how to pay the deposit</h3>
            <RadioGroup defaultValue="credit" className="space-y-4">
              <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="credit" 
                    id="credit"
                    className="border-[#1A3174] text-[#1A3174] [&[data-state=checked]]:bg-[#1A3174] [&[data-state=checked]]:text-white"
                  />
                  <Label htmlFor="credit" className="font-medium">
                    Pay $100.00 deposit with credit or debit card
                  </Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="paypal" 
                    id="paypal"
                    className="border-[#1A3174] text-[#1A3174] [&[data-state=checked]]:bg-[#1A3174] [&[data-state=checked]]:text-white"
                  />
                  <Label htmlFor="paypal" className="font-medium">
                    Pay $100.00 deposit with PayPal
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input placeholder="Enter coupon code" className="flex-1" />
              <Button variant="default" className="bg-[#1A3174]">Apply</Button>
            </div>
            <p className="text-gray-500 text-sm">No coupon applied</p>
          </div>

          <div className="space-y-4">
            <Input placeholder="Card number" />
            <div className="grid grid-cols-3 gap-4">
              <Input placeholder="MM" />
              <Input placeholder="YY" />
              <Input placeholder="CVV" />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="sticky bottom-0 left-0 right-0 bg-white py-4 px-4 border-t">
        <div className="flex gap-4 w-full">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5"
          >
            Back
          </Button>
          <Button 
            className="flex-1 bg-[#1A3174] text-white hover:bg-[#1A3174]/90"
          >
            Complete your order
          </Button>
        </div>
      </div>
    </div>
  );
}
