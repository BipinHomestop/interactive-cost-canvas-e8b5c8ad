import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CalculatorInputs {
  location: string;
  name: string;
  phone: string;
  email: string;
  garageCapacity: number;
  garageFinish: string;
  needStemWalls: string;
  stemWallType?: string;
}

type StepImages = {
  [key: number]: string | { [key: string]: string };
};

const STEP_IMAGES: StepImages = {
  1: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=500&q=80",
  2: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  3: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=500&q=80",
  4: {
    snowfall: "/lovable-uploads/36204769-3ce1-4ebb-bfab-01295ad47562.png",
    granite: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
    slate: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=500&q=80",
  }
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

const GARAGE_FINISHES = [
  { value: "snowfall", label: "Snowfall (Most Popular)" },
  { value: "granite", label: "Granite" },
  { value: "slate", label: "Slate" },
];

const STEM_WALL_TYPES = [
  { value: "standard", label: "4\" Standard" },
  { value: "large", label: "Large Stem Walls" },
];

export function CostCalculator() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const { register, handleSubmit, setValue, watch, control } = useForm<CalculatorInputs>({
    defaultValues: {
      location: "",
      name: "",
      phone: "",
      email: "",
      garageCapacity: 1,
      garageFinish: "snowfall",
      needStemWalls: "no",
      stemWallType: undefined,
    },
  });

  const formValues = useWatch({ control });
  const selectedFinish = watch("garageFinish");
  const needStemWalls = watch("needStemWalls");

  useEffect(() => {
    calculateCost();
  }, [formValues]);

  const calculateCost = () => {
    const basePrice = formValues.garageCapacity * 1000;
    const finishMultiplier = formValues.garageFinish === "snowfall" ? 1.2 : 1;
    let total = basePrice * finishMultiplier;

    if (formValues.needStemWalls === "yes") {
      total += formValues.stemWallType === "standard" ? 500 : 1000;
    }
    
    setTotalCost(total);
  };

  const getStepImage = () => {
    const image = STEP_IMAGES[step];
    if (typeof image === 'string') return image;
    if (step === 4 && typeof image === 'object') {
      return image[selectedFinish] || image.snowfall;
    }
    return '';
  };

  const nextStep = () => {
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex gap-8 items-stretch">
      <div className="w-1/2">
        <img
          src={getStepImage()}
          alt={`Step ${step} visualization`}
          className="w-full rounded-lg shadow-lg h-[600px] object-cover"
        />
      </div>
      
      <div className="w-1/2 bg-white p-6 rounded-lg shadow-md h-[600px] overflow-y-auto">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex-1 h-2 mx-1 rounded ${
                  stepNumber <= step ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            Step {step} of 4
          </div>
        </div>

        <form onSubmit={handleSubmit(calculateCost)} className="space-y-6">
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center mb-6">Garage Finish</h2>
              <div className="grid gap-4">
                {GARAGE_FINISHES.map((finish) => (
                  <div
                    key={finish.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedFinish === finish.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => setValue("garageFinish", finish.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div>
                        <p className="font-medium">{finish.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <Label>Do you need stem walls?</Label>
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => setValue("needStemWalls", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>

                {needStemWalls === "yes" && (
                  <div className="space-y-4 mt-4">
                    <Label>Select Stem Wall Type</Label>
                    <RadioGroup
                      defaultValue="standard"
                      onValueChange={(value) => setValue("stemWallType", value)}
                    >
                      {STEM_WALL_TYPES.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={type.value} id={type.value} />
                          <Label htmlFor={type.value}>{type.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            )}
            {step < 4 && (
              <Button type="button" className="ml-auto" onClick={nextStep}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {totalCost !== null && (
            <div className="mt-6 p-4 bg-primary/5 rounded-md">
              <h3 className="text-lg font-semibold">Your Price: ${totalCost}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Market Price: ${Math.round(totalCost * 1.4)}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}