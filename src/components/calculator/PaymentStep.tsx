
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
    <div className="space-y-6">
      {/* Price Breakdown */}
      <div className="bg-[#F1F0FB] p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-[#1A1F2C]">Price Breakdown</h3>
        <div className="space-y-3">
          {renderPriceBreakdown().map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-[#403E43]">{item.label}</span>
              <span className="font-medium text-[#1A1F2C]">${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-[#D6BCFA] pt-3 mt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span className="text-[#1A1F2C]">Total</span>
              <span className="text-[#9b87f5]">${totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Date */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#1A1F2C]">Choose Installation Date</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal border-[#D6BCFA] hover:border-[#9b87f5] hover:bg-[#F1F0FB]",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-[#9b87f5]" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
              className="rounded-md border border-[#D6BCFA]"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#1A1F2C]">Choose how to pay the deposit</h3>
        <RadioGroup defaultValue="credit" className="space-y-3">
          <div className="flex items-center space-x-3 border border-[#D6BCFA] rounded-lg p-4 hover:bg-[#F1F0FB] transition-colors">
            <RadioGroupItem value="credit" id="credit" className="border-[#9b87f5] text-[#9b87f5]" />
            <Label htmlFor="credit" className="flex-grow text-[#403E43]">
              Pay $100.00 deposit with credit or debit card
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 border border-[#D6BCFA] rounded-lg p-4 hover:bg-[#F1F0FB] transition-colors">
            <RadioGroupItem value="paypal" id="paypal" className="border-[#9b87f5] text-[#9b87f5]" />
            <Label htmlFor="paypal" className="flex-grow text-[#403E43]">
              Pay $100.00 deposit with PayPal
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Coupon Code */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input 
            placeholder="Enter coupon code" 
            className="flex-1 border-[#D6BCFA] focus-visible:ring-[#9b87f5]" 
          />
          <Button 
            variant="default" 
            className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors"
          >
            Apply
          </Button>
        </div>
        <p className="text-sm text-[#8A898C]">No coupon applied</p>
      </div>

      {/* Card Details */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-[#1A1F2C] flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-[#9b87f5]" />
          Card Details
        </h3>
        <div className="space-y-3">
          <Input 
            placeholder="Card number" 
            className="border-[#D6BCFA] focus-visible:ring-[#9b87f5]"
          />
          <div className="grid grid-cols-3 gap-3">
            <Input 
              placeholder="MM" 
              className="border-[#D6BCFA] focus-visible:ring-[#9b87f5]"
            />
            <Input 
              placeholder="YY" 
              className="border-[#D6BCFA] focus-visible:ring-[#9b87f5]"
            />
            <Input 
              placeholder="CVV" 
              className="border-[#D6BCFA] focus-visible:ring-[#9b87f5]"
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 left-0 right-0 bg-white py-4 border-t border-[#D6BCFA] mt-6">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 border-[#9b87f5] text-[#9b87f5] hover:bg-[#F1F0FB]"
          >
            Back
          </Button>
          <Button 
            className="flex-1 bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
          >
            Complete your order
          </Button>
        </div>
      </div>
    </div>
  );
}
