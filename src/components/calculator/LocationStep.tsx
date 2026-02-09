import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { InputSanitizer } from "@/components/security/InputSanitizer";

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
  const [isValid, setIsValid] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    
    setZipCode(rawValue);
    setError(null);
    setIsValid(false);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    if (rawValue.length === 5) {
      const timeout = setTimeout(() => {
        validateZipCode(rawValue);
      }, 300);
      
      setTypingTimeout(timeout);
    }
  };
  
  const validateZipCode = async (value: string = zipCode) => {
    const sanitizedValue = InputSanitizer.sanitizeZipCode(value);
    
    if (!sanitizedValue || sanitizedValue.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code");
      return false;
    }
    
    setIsValidating(true);
    
    try {
      try {
        await supabase
          .from('analytics_location_visits')
          .insert({
            zipcode: sanitizedValue,
            page_visited: 'location-zipcode-search',
            time_range: '30d'
          });
      } catch (analyticsError) {
        console.error('Error logging zipcode search:', analyticsError);
      }
      
      const { data, error: queryError } = await supabase
        .from('service_area_zipcodes')
        .select('zipcode')
        .eq('zipcode', sanitizedValue)
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
        setIsValid(false);
        setIsValidating(false);
        
        try {
          await supabase
            .from('analytics_location_visits')
            .insert({
              zipcode: sanitizedValue,
              page_visited: 'location-zipcode-not-served',
              time_range: '30d'
            });
        } catch (analyticsError) {
          console.error('Error logging non-service zipcode:', analyticsError);
        }
        
        return false;
      }
      
      setError(null);
      setIsValid(true);
      setIsValidating(false);
      
      try {
        await supabase
          .from('analytics_location_visits')
          .insert({
            zipcode: sanitizedValue,
            page_visited: 'location-zipcode-valid',
            time_range: '30d'
          });
      } catch (analyticsError) {
        console.error('Error logging valid zipcode:', analyticsError);
      }
      
      onLocationChange(sanitizedValue);
      
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
        <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-[#1A3174] mb-2`}>Where's Your Project Located?</h2>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-gray-600 mb-4`}>
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
            className={cn(
              "w-full h-12 pl-10 hover:border-[#1A3174] focus:ring-[#1A3174] focus:border-[#1A3174]",
              isValid && "border-green-500 pr-10",
              error && "border-red-500 pr-10"
            )}
            placeholder="Enter ZIP code"
            inputMode="numeric"
            maxLength={5}
          />
          {isValid && !isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 z-10">
              <CheckCircle size={20} />
            </div>
          )}
          {error && !isValidating && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 z-10">
              <AlertTriangle size={20} />
            </div>
          )}
        </div>
        
        {isValidating && (
          <div className="text-sm text-blue-500 flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span>Checking availability...</span>
          </div>
        )}
        
        {error && !isValidating && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}
        
        {isValid && !isValidating && (
          <Alert 
            variant="default" 
            className="bg-green-50 border-green-200 py-2"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <AlertDescription className="text-green-700 text-sm font-medium">
                Great! We serve your area.
              </AlertDescription>
            </div>
          </Alert>
        )}
      </div>

      <p className="text-sm text-gray-500 text-center">
        Please enter your ZIP code above <span className="text-red-500">*</span>
      </p>
    </div>
  );
}
