import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface CalculatorInputs {
  quantity: number;
  serviceType: string;
  additionalFeatures: string;
}

const BASE_PRICES = {
  basic: 100,
  standard: 200,
  premium: 300,
};

const FEATURE_PRICES = {
  rush: 50,
  priority: 30,
  standard: 0,
};

export function CostCalculator() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { register, handleSubmit, setValue, watch, trigger } = useForm<CalculatorInputs>({
    defaultValues: {
      quantity: 1,
      serviceType: "basic",
      additionalFeatures: "standard",
    },
  });

  const onSubmit = (data: CalculatorInputs) => {
    const basePrice = BASE_PRICES[data.serviceType as keyof typeof BASE_PRICES];
    const featurePrice =
      FEATURE_PRICES[data.additionalFeatures as keyof typeof FEATURE_PRICES];
    const total = (basePrice + featurePrice) * data.quantity;
    setTotalCost(total);

    toast({
      title: "Quote Generated",
      description: `Your estimated cost is $${total}`,
    });
  };

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex-1 h-2 mx-1 rounded ${
                stepNumber <= step ? "bg-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="text-center text-sm text-gray-600">
          Step {step} of 3: {step === 1 ? "Quantity" : step === 2 ? "Service Type" : "Additional Features"}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...register("quantity", { valueAsNumber: true })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Select
              onValueChange={(value) => setValue("serviceType", value)}
              defaultValue="basic"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic ($100)</SelectItem>
                <SelectItem value="standard">Standard ($200)</SelectItem>
                <SelectItem value="premium">Premium ($300)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="additionalFeatures">Additional Features</Label>
              <Select
                onValueChange={(value) => setValue("additionalFeatures", value)}
                defaultValue="standard"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select additional features" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (No additional cost)</SelectItem>
                  <SelectItem value="priority">Priority Service (+$30)</SelectItem>
                  <SelectItem value="rush">Rush Service (+$50)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Calculate Cost
            </Button>
          </>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {step < 3 && (
            <Button type="button" className="ml-auto" onClick={nextStep}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {totalCost !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900">Total Cost</h3>
            <p className="text-2xl font-bold text-primary">${totalCost}</p>
          </div>
        )}
      </form>
    </div>
  );
}