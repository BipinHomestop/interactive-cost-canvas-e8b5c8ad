import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

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

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key is not set');
        return;
      }

      // Remove any existing Google Maps scripts to prevent duplicates
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "us" },
        types: ['address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          onLocationChange(place.formatted_address);
        }
      });
    };

    loadGoogleMapsScript();

    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com/maps/api"]');
      if (script) {
        script.remove();
      }
    };
  }, [onLocationChange]);

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
          placeholder="Enter your address"
        />
      </div>
    </div>
  );
}