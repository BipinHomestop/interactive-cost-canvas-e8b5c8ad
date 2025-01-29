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
    <div className="space-y-2">
      <Label htmlFor="location">Select Your Location</Label>
      <Select onValueChange={onLocationChange} defaultValue="">
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
  );
}