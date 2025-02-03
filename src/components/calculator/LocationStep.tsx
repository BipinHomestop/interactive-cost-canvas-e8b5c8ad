import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationStepProps {
  onLocationChange: (value: string) => void;
}

const DFW_LOCATIONS = [
  "Dallas, TX",
  "Fort Worth, TX",
  "Plano, TX",
  "Arlington, TX",
  "Irving, TX",
  "Frisco, TX",
  "McKinney, TX",
  "Denton, TX",
  "Carrollton, TX",
  "Richardson, TX",
  "Lewisville, TX",
  "Allen, TX",
  "Garland, TX",
  "Grand Prairie, TX",
  "Mesquite, TX",
  "Grapevine, TX",
  "Flower Mound, TX",
  "Southlake, TX",
  "Addison, TX",
  "Coppell, TX"
];

export function LocationStep({ onLocationChange }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Where's Your Project Located?</h2>
        <p className="text-gray-600 mb-8">
          Select your location from the DFW area to get started with your garage renovation estimate
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
          <MapPin size={20} />
        </div>
        <Select onValueChange={onLocationChange}>
          <SelectTrigger className="w-full pl-10">
            <SelectValue placeholder="Select your location" />
          </SelectTrigger>
          <SelectContent>
            {DFW_LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Please select your city from the dropdown above
      </p>
    </div>
  );
}