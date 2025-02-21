
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Garage } from "lucide-react";

interface GarageCapacityStepProps {
  onCapacityChange: (value: number) => void;
}

export function GarageCapacityStep({ onCapacityChange }: GarageCapacityStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">How Many Cars Is Your Garage?</h2>
        <p className="text-gray-600 mb-8">
          Select the capacity of your garage to help us provide an accurate estimate
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
          <Garage size={20} />
        </div>
        <Select onValueChange={(value) => onCapacityChange(Number(value))} required>
          <SelectTrigger className="w-full pl-10 hover:border-[#1A3174] focus:ring-[#1A3174] focus:border-[#1A3174]">
            <SelectValue placeholder="Select garage capacity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Car Garage</SelectItem>
            <SelectItem value="2">2 Car Garage</SelectItem>
            <SelectItem value="3">3 Car Garage</SelectItem>
            <SelectItem value="4">4 Car Garage</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Please select your garage capacity <span className="text-red-500">*</span>
      </p>
    </div>
  );
}
