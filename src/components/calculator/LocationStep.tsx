import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

interface LocationStepProps {
  onLocationChange: (value: string) => void;
}

export function LocationStep({ onLocationChange }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Select Your Location</h2>
        <p className="text-gray-600 mb-8">
          Choose your city to get started with your garage renovation estimate
        </p>
      </div>

      <div className="relative">
        <Select onValueChange={onLocationChange} defaultValue="">
          <SelectTrigger className="h-14 w-full px-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
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
    </div>
  );
}