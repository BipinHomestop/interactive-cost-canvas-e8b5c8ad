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
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { register, handleSubmit, setValue, watch } = useForm<CalculatorInputs>({
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            {...register("quantity", { valueAsNumber: true })}
          />
        </div>

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