
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GarageCapacityStepProps {
  onCapacityChange: (value: number) => void;
}

export function GarageCapacityStep({ onCapacityChange }: GarageCapacityStepProps) {
  const [capacity, setCapacity] = useState(1);

  const increment = () => {
    if (capacity < 4) {
      const newCapacity = capacity + 1;
      setCapacity(newCapacity);
      onCapacityChange(newCapacity);
    }
  };

  const decrement = () => {
    if (capacity > 1) {
      const newCapacity = capacity - 1;
      setCapacity(newCapacity);
      onCapacityChange(newCapacity);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">How Many Cars Is Your Garage?</h2>
        <p className="text-gray-600 mb-8">
          Select the capacity of your garage to help us provide an accurate estimate
        </p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={capacity <= 1}
          className="h-14 w-14 border-2 hover:border-[#1A3174] hover:text-[#1A3174]"
        >
          <Minus className="h-6 w-6" />
        </Button>
        <div className="w-20 h-14 flex items-center justify-center text-2xl font-bold border-2 rounded-md">
          {capacity}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={capacity >= 4}
          className="h-14 w-14 border-2 hover:border-[#1A3174] hover:text-[#1A3174]"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Please select your garage capacity <span className="text-red-500">*</span>
      </p>
    </div>
  );
}
