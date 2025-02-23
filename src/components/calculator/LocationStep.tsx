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
  "Coppell, TX",
  "Euless, TX",
  "Bedford, TX",
  "Hurst, TX",
  "North Richland Hills, TX",
  "Keller, TX",
  "Colleyville, TX",
  "Watauga, TX",
  "Haltom City, TX",
  "Duncanville, TX",
  "Cedar Hill, TX",
  "DeSoto, TX",
  "Lancaster, TX",
  "Rowlett, TX",
  "Wylie, TX",
  "Sachse, TX",
  "Murphy, TX",
  "Parker, TX",
  "Lucas, TX",
  "Prosper, TX",
  "Celina, TX",
  "Little Elm, TX",
  "The Colony, TX",
  "Highland Village, TX",
  "Lake Dallas, TX",
  "Corinth, TX",
  "Roanoke, TX",
  "Trophy Club, TX",
  "Westlake, TX",
  "Argyle, TX",
  "Hickory Creek, TX",
  "Copper Canyon, TX",
  "Double Oak, TX",
  "Bartonville, TX",
  "Lantana, TX",
  "Highland Park, TX",
  "University Park, TX",
  "Farmers Branch, TX",
  "Red Oak, TX",
  "Glenn Heights, TX",
  "Ovilla, TX",
  "Midlothian, TX",
  "Mansfield, TX",
  "Kennedale, TX",
  "Forest Hill, TX",
  "White Settlement, TX",
  "Saginaw, TX",
  "Blue Mound, TX",
  "Lake Worth, TX",
  "Sansom Park, TX",
  "River Oaks, TX",
  "Westworth Village, TX",
  "Benbrook, TX",
  "Everman, TX",
  "Pantego, TX",
  "Dalworthington Gardens, TX",
  "Cockrell Hill, TX",
  "Balch Springs, TX",
  "Seagoville, TX",
  "Hutchins, TX",
  "Wilmer, TX",
  "Combine, TX",
  "Sunnyvale, TX",
  "Rockwall, TX",
  "Heath, TX",
  "McLendon-Chisholm, TX",
  "Fate, TX",
  "Royse City, TX",
  "Princeton, TX",
  "Anna, TX",
  "Melissa, TX",
  "Van Alstyne, TX",
  "Fairview, TX",
  "St. Paul, TX"
];

export function LocationStep({ onLocationChange }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Where's Your Project Located?</h2>
        <p className="text-gray-600 mb-8">
          Select your location from the DFW area to get started with your garage renovation estimate
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
          <MapPin size={20} />
        </div>
        <Select onValueChange={onLocationChange} required>
          <SelectTrigger className="w-full pl-10 hover:border-[#1A3174] focus:ring-[#1A3174] focus:border-[#1A3174]">
            <SelectValue placeholder="Select your location" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {DFW_LOCATIONS.map((location) => (
              <SelectItem 
                key={location} 
                value={location}
                className="hover:bg-[#1A3174]/10 focus:bg-[#1A3174]/10"
              >
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Please select your city from the dropdown above <span className="text-red-500">*</span>
      </p>
    </div>
  );
}
