
import { useState } from "react";
import { MapPin, AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
    
    try {
      // Query the service_area_zipcodes table to check if the zipcode is in our service area
      const { data, error: queryError } = await supabase
        .from('service_area_zipcodes')
        .select('zipcode')
        .eq('zipcode', zipCode)
        .eq('is_active', true)
        .maybeSingle();
      
      if (queryError) {
        console.error('Error checking zipcode:', queryError);
        setError("There was an error checking your ZIP code. Please try again.");
        setIsValidating(false);
        return false;
      }
      
      if (!data) {
        setError("We do not serve that area");
        setIsValidating(false);
        return false;
      }
      
      // Clear any previous errors
      setError(null);
      // Pass the zipcode to parent component
      onLocationChange(zipCode);
      setIsValidating(false);
      return true;
    } catch (err) {
      console.error('Unexpected error during zipcode validation:', err);
      setError("There was an error checking your ZIP code. Please try again.");
      setIsValidating(false);
      return false;
    }
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
