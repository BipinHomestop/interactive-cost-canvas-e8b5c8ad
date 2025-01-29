import { useState, useCallback, useEffect } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const libraries: ("places")[] = ["places"];

// Define the coordinates for Dallas-Fort Worth area
const DFW_BOUNDS = {
  north: 33.0369,
  south: 32.3442,
  east: -96.5177,
  west: -97.5137
};

interface LocationStepProps {
  onLocationChange: (value: string) => void;
}

export function LocationStep({ onLocationChange }: LocationStepProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");

  useEffect(() => {
    const fetchApiKey = async () => {
      const { data: { GOOGLE_MAPS_API_KEY }, error } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'GOOGLE_MAPS_API_KEY' }
      });
      
      if (error) {
        console.error('Error fetching API key:', error);
        return;
      }
      
      setApiKey(GOOGLE_MAPS_API_KEY);
    };

    fetchApiKey();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    // Set bounds to Dallas-Fort Worth area
    const bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(DFW_BOUNDS.south, DFW_BOUNDS.west),
      new google.maps.LatLng(DFW_BOUNDS.north, DFW_BOUNDS.east)
    );
    
    autocomplete.setBounds(bounds);
    autocomplete.setOptions({
      strictBounds: true,
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });
    
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      
      if (place.geometry) {
        const lat = place.geometry.location?.lat();
        const lng = place.geometry.location?.lng();
        
        // Check if location is within DFW bounds
        if (lat && lng &&
            lat >= DFW_BOUNDS.south && 
            lat <= DFW_BOUNDS.north && 
            lng >= DFW_BOUNDS.west && 
            lng <= DFW_BOUNDS.east) {
          
          const formattedAddress = place.formatted_address || '';
          onLocationChange(formattedAddress);
        } else {
          toast({
            title: "Location Error",
            description: "Please select a location within the Dallas-Fort Worth area",
            variant: "destructive"
          });
        }
      }
    }
  };

  if (loadError) {
    return (
      <div className="text-red-500">
        Error loading Google Maps. Please try again later.
      </div>
    );
  }

  if (!isLoaded || !apiKey) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="location">Enter Your Address (Dallas-Fort Worth area only)</Label>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <Input
          id="location"
          type="text"
          className="w-full"
          placeholder="Start typing your address..."
        />
      </Autocomplete>
      <p className="text-sm text-gray-500 mt-2">
        Note: Only addresses within the Dallas-Fort Worth area are accepted
      </p>
    </div>
  );
}