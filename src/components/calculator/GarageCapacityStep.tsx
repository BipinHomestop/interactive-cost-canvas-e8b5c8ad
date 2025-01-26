import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface GarageCapacityStepProps {
  capacity: number;
  onCapacityChange: (value: number[]) => void;
}

export function GarageCapacityStep({ capacity, onCapacityChange }: GarageCapacityStepProps) {
  return (
    <div className="space-y-4">
      <Label>Maximum Cars in Garage</Label>
      <div className="pt-6">
        <Slider
          defaultValue={[capacity]}
          max={5}
          min={1}
          step={1}
          onValueChange={onCapacityChange}
        />
        <div className="mt-2 text-center text-sm text-gray-600">
          {capacity} {capacity === 1 ? "car" : "cars"}
        </div>
      </div>
    </div>
  );
}