
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

interface GarageCapacityStepProps {
  capacity: number;
  onCapacityChange: (value: number[]) => void;
}

export function GarageCapacityStep({ capacity, onCapacityChange }: GarageCapacityStepProps) {
  const isMobile = useIsMobile();
  
  // Log capacity changes
  useEffect(() => {
    console.log("GarageCapacityStep rendering with capacity:", capacity);
  }, [capacity]);
  
  const handleIncrement = () => {
    if (capacity < 5) {
      console.log("Incrementing capacity to:", capacity + 1);
      onCapacityChange([capacity + 1]);
    }
  };

  const handleDecrement = () => {
    if (capacity > 1) {
      console.log("Decrementing capacity to:", capacity - 1);
      onCapacityChange([capacity - 1]);
    }
  };

  return (
    <div className={`space-y-8 ${isMobile ? 'px-2 pb-24' : ''}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Garage Capacity</h2>
        <p className="text-gray-600 mb-4">
          Select the number of cars your garage needs to accommodate
        </p>
      </div>

      <div className="text-center pt-4">
        <div className="text-7xl font-bold text-primary mb-4">{capacity}</div>
        <div className="text-4xl font-semibold text-primary uppercase tracking-wider">CAR</div>
      </div>
      
      <div className={`flex justify-center items-center ${isMobile ? 'gap-10 mt-8' : 'gap-16 mt-8'}`}>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`rounded-full ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} border-2 ${
            capacity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
          }`}
          onClick={handleDecrement}
          disabled={capacity <= 1}
        >
          <Minus className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={`rounded-full ${isMobile ? 'w-14 h-14' : 'w-16 h-16'} border-2 ${
            capacity >= 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
          }`}
          onClick={handleIncrement}
          disabled={capacity >= 5}
        >
          <Plus className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
        </Button>
      </div>
    </div>
  );
}
