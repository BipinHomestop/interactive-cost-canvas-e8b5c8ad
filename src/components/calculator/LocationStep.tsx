import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LocationStepProps {
  onLocationChange: (value: string) => void;
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            opts?: {
              componentRestrictions?: { country: string };
              types?: string[];
            }
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => { formatted_address?: string };
          };
        };
      };
    };
  }
}

export function LocationStep({ onLocationChange }: LocationStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data: { GOOGLE_MAPS_API_KEY } } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'GOOGLE_MAPS_API_KEY' }
        });
        setApiKey(GOOGLE_MAPS_API_KEY);
      } catch (error) {
        console.error('Error fetching API key:', error);
        setManualInput(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Notice",
          description: "Location suggestions are unavailable. You can enter your address manually.",
        });
      }
    };

    fetchApiKey();
  }, [toast]);

  useEffect(() => {
    if (!apiKey) return;

    const loadGoogleMapsScript = () => {
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeAutocomplete();
        setIsLoading(false);
      };
      
      script.onerror = () => {
        console.error('Failed to load Google Maps script');
        setManualInput(true);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Notice",
          description: "Location suggestions are unavailable. You can enter your address manually.",
        });
      };
      
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: "us" },
          types: ['address']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setLocation(place.formatted_address);
            onLocationChange(place.formatted_address);
          }
        });
      } catch (error) {
        console.error('Error initializing autocomplete:', error);
        setManualInput(true);
        toast({
          variant: "destructive",
          title: "Notice",
          description: "Location suggestions are unavailable. You can enter your address manually.",
        });
      }
    };

    loadGoogleMapsScript();

    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script) {
        script.remove();
      }
    };
  }, [apiKey, onLocationChange, toast]);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    onLocationChange(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Where's Your Project Located?</h2>
        <p className="text-gray-600 mb-8">
          Enter your address to get started with your garage renovation estimate
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <MapPin size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full px-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={isLoading ? "Loading location services..." : "Enter your address"}
          disabled={isLoading}
          onChange={manualInput ? handleManualInput : undefined}
          value={location}
        />
      </div>

      {manualInput && (
        <p className="text-sm text-gray-500 text-center">
          Enter your complete address including street, city, state, and ZIP code
        </p>
      )}
    </div>
  );
}