import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  location: string;
  name: string;
  phone: string;
  email: string;
  garageCapacity: number;
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

const SERVICE_IMAGES = {
  basic: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80",
  standard: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80",
  premium: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=500&q=80",
};

const TEXAS_CITIES = [
  "Houston",
  "San Antonio",
  "Dallas",
  "Austin",
  "Fort Worth",
  "El Paso",
  "Arlington",
  "Corpus Christi",
];

export function CostCalculator() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { register, handleSubmit, setValue, watch, trigger } = useForm<CalculatorInputs>({
    defaultValues: {
      location: "",
      name: "",
      phone: "",
      email: "",
      garageCapacity: 1,
      quantity: 1,
      serviceType: "basic",
      additionalFeatures: "standard",
    },
  });

  const serviceType = watch("serviceType");

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
      setStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex gap-8 items-start">
      <div className="w-1/2">
        <img
          src={SERVICE_IMAGES[serviceType as keyof typeof SERVICE_IMAGES]}
          alt={`${serviceType} service visualization`}
          className="w-full rounded-lg shadow-lg mb-4 aspect-video object-cover"
        />
      </div>
      
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 h-2 mx-1 rounded ${
                  stepNumber <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {step} of 6
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-2">
              <Label htmlFor="location">Select Your Location</Label>
              <Select
                onValueChange={(value) => setValue("location", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {TEXAS_CITIES.map((city) => (
                    <SelectItem key={city} value={city.toLowerCase()}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Label>Maximum Cars in Garage</Label>
              <div className="pt-6">
                <Slider
                  defaultValue={[1]}
                  max={5}
                  min={1}
                  step={1}
                  onValueChange={([value]) => setValue("garageCapacity", value)}
                />
                <div className="mt-2 text-center text-sm text-gray-600">
                  {watch("garageCapacity")} {watch("garageCapacity") === 1 ? "car" : "cars"}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
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

          {step === 5 && (
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

          {step === 6 && (
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
            {step < 6 && (
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
    </div>
  );
}