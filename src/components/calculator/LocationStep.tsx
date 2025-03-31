
import { useState } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Define service area zipcodes - this would ideally come from the database
const DFW_ZIPCODES = [
  "75201", "75202", "75203", "75204", "75205", "75206", "75207", "75208", "75209", "75210",
  "75211", "75212", "75214", "75215", "75216", "75217", "75218", "75219", "75220", "75221",
  "75222", "75223", "75224", "75225", "75226", "75227", "75228", "75229", "75230", "75231",
  "75232", "75233", "75234", "75235", "75236", "75237", "75238", "75240", "75241", "75242",
  "75243", "75244", "75246", "75247", "75248", "75249", "75250", "75251", "75252", "75253",
  "76001", "76002", "76006", "76010", "76011", "76012", "76013", "76014", "76015", "76016",
  "76017", "76018", "76019", "76020", "76021", "76022", "76034", "76039", "76040", "76051",
  "76052", "76053", "76054", "76060", "76063", "76092", "76094", "76096", "76097", "76098",
  "76099", "76101", "76102", "76103", "76104", "76105", "76106", "76107", "76108", "76109",
  "76110", "76111", "76112", "76113", "76114", "76115", "76116", "76117", "76118", "76119",
  "76120", "76121", "76122", "76123", "76124", "76126", "76127", "76129", "76130", "76131",
  "76132", "76133", "76134", "76135", "76136", "76137", "76140", "76147", "76148", "76150",
  "76155", "76161", "76162", "76163", "76164", "76166", "76177", "76179", "76180", "76181",
  "76182", "76185", "76191", "76192", "76193", "76195", "76196", "76197", "76198", "76199"
];

interface LocationStepProps {
  onLocationChange: (value: string) => void;
}

export function LocationStep({
  onLocationChange
}: LocationStepProps) {
  const isMobile = useIsMobile();
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and limit to 5 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setZipCode(value);
    
    // Clear error when user is typing
    if (error) setError(null);
  };
  
  const validateZipCode = async () => {
    if (zipCode.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code");
      return false;
    }
    
    setIsValidating(true);
    
    // Check if zipcode is in our service area
    const isInServiceArea = DFW_ZIPCODES.includes(zipCode);
    
    setIsValidating(false);
    
    if (!isInServiceArea) {
      setError("We do not serve that area");
      return false;
    }
    
    // Clear any previous errors
    setError(null);
    // Pass the zipcode to parent component
    onLocationChange(zipCode);
    return true;
  };
  
  return (
    <div className={`space-y-4 px-4 ${isMobile ? 'pb-4' : ''}`}>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Where's Your Project Located?</h2>
        <p className="text-gray-600 mb-4">
          Enter your ZIP code to get started with your garage renovation estimate
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
            <MapPin size={20} />
          </div>
          <Input
            type="text"
            value={zipCode}
            onChange={handleZipCodeChange}
            className="w-full h-12 pl-10 hover:border-[#1A3174] focus:ring-[#1A3174] focus:border-[#1A3174]"
            placeholder="Enter ZIP code"
            inputMode="numeric"
            maxLength={5}
          />
        </div>
        
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        <Button 
          type="button" 
          onClick={validateZipCode}
          className="w-full bg-[#1A3174] hover:bg-[#132456] text-white h-12"
          disabled={zipCode.length !== 5 || isValidating}
        >
          {isValidating ? "Checking..." : "Check Availability"}
        </Button>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Please enter your ZIP code above <span className="text-red-500">*</span>
      </p>
    </div>
  );
}
