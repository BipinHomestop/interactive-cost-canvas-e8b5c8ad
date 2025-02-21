
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
    <div className="space-y-12 max-w-md mx-auto py-8">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="text-[120px] font-bold text-[#1A3174] leading-none">
            {capacity}
          </div>
          <div className="text-4xl font-bold text-[#1A3174]">
            CAR
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-16 relative">
          <div className="h-px w-32 bg-gray-200 absolute"></div>
          <Button
            variant="outline"
            size="icon"
            onClick={decrement}
            disabled={capacity <= 1}
            className="relative z-10 h-14 w-14 rounded-full border-2 border-[#1A3174] bg-[#1A3174] text-white hover:bg-[#1A3174]/90 hover:border-[#1A3174]/90"
          >
            <Minus className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={increment}
            disabled={capacity >= 4}
            className="relative z-10 h-14 w-14 rounded-full border-2 border-[#1A3174] bg-[#1A3174] text-white hover:bg-[#1A3174]/90 hover:border-[#1A3174]/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
