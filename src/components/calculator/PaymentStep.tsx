import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentStepProps {
  onBack: () => void;
}

export function PaymentStep({ onBack }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Choose how to pay the deposit</h2>
        <p className="text-gray-600">Pay only $100 deposit. The remaining balance upon completion.</p>
      </div>

      <RadioGroup defaultValue="credit" className="space-y-4">
        <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="credit" id="credit" />
            <Label htmlFor="credit" className="font-medium">
              Pay $100.00 deposit with credit or debit card
            </Label>
          </div>
        </div>
        
        <div className="flex items-center justify-between space-x-2 border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="font-medium">
              Pay $100.00 deposit with PayPal - Payment options available
            </Label>
          </div>
        </div>
      </RadioGroup>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <Input placeholder="Enter coupon code" className="flex-1" />
          <Button variant="default" className="bg-[#0A0B3B]">Apply</Button>
        </div>
        <p className="text-gray-500 text-sm">No coupon applied</p>
      </div>

      <div className="space-y-4">
        <Input placeholder="Card number" />
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="MM" />
          <Input placeholder="YYYY" />
        </div>
        <Input placeholder="CVV" />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button className="bg-[#E88D4D] hover:bg-[#E88D4D]/90">
          Complete your order
        </Button>
      </div>
    </div>
  );
}