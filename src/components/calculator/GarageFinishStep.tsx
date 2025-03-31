
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";

const GARAGE_FINISHES = [{
  value: "carbon",
  label: "Carbon"
}, {
  value: "cabin-fever",
  label: "Cabin Fever"
}, {
  value: "creekbed",
  label: "Creekbed"
}, {
  value: "domino",
  label: "Domino"
}, {
  value: "nightfall",
  label: "Nightfall"
}, {
  value: "orbit",
  label: "Orbit"
}, {
  value: "outback",
  label: "Outback"
}, {
  value: "pecan",
  label: "Pecan"
}, {
  value: "shoreline",
  label: "Shoreline"
}, {
  value: "snowfall",
  label: "Snowfall"
}, {
  value: "tidal-wave",
  label: "Tidal Wave"
}, {
  value: "wombat",
  label: "Wombat"
}];

// Define a set of valid finish values for quick lookup
const VALID_FINISHES = new Set(GARAGE_FINISHES.map(finish => finish.value));

interface GarageFinishStepProps {
  selectedFinish: string;
  onFinishChange: (value: string) => void;
}

export function GarageFinishStep({
  selectedFinish,
  onFinishChange
}: GarageFinishStepProps) {
  const [finishImages, setFinishImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [finishOptions, setFinishOptions] = useState(GARAGE_FINISHES);
  const isMobile = useIsMobile();

  // Load the finish images from the database
  useEffect(() => {
    const loadOptionImages = async () => {
      setIsLoading(true);
      try {
        const { data: images, error } = await supabase
          .from('calculator_step_images')
          .select('image_type, image_path')
          .eq('step_number', 4)
          .like('image_type', 'option-%');

        if (error) {
          console.error('Error loading finish images:', error);
          toast({
            title: "Error loading images",
            description: "There was a problem loading finish option images.",
            variant: "destructive"
          });
          return;
        }

        // Filter out any image data for finishes that are not in our current list
        const currentImages = images.filter(img => {
          const finishType = img.image_type.replace('option-', '');
          return VALID_FINISHES.has(finishType);
        });

        const imageMap = currentImages.reduce((acc: Record<string, string>, img) => {
          // Extract the finish type from the image_type (remove 'option-' prefix)
          const finishType = img.image_type.replace('option-', '');
          acc[finishType] = img.image_path;
          return acc;
        }, {});

        console.log('Loaded finish images:', imageMap);
        setFinishImages(imageMap);
      } catch (error) {
        console.error('Error in loadOptionImages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOptionImages();
  }, []);

  // Check if the selected finish is still valid, if not reset it
  useEffect(() => {
    if (selectedFinish && !VALID_FINISHES.has(selectedFinish)) {
      // Reset to first valid option if the current selection is invalid
      onFinishChange(GARAGE_FINISHES[0].value);
    }
  }, [selectedFinish, onFinishChange]);

  // Sync finishOptions with the available images
  useEffect(() => {
    // Only update options when we have images loaded
    if (Object.keys(finishImages).length > 0) {
      // Filter GARAGE_FINISHES to only include options with images
      // If we need to ALWAYS show all options (even without images), remove this logic
      const availableOptions = GARAGE_FINISHES.filter(finish => 
        // Either it has an image or we want to show it anyway
        finishImages[finish.value] || VALID_FINISHES.has(finish.value)
      );
      
      if (availableOptions.length > 0) {
        setFinishOptions(availableOptions);
        
        // If current selection isn't in the available options, reset to first available
        if (selectedFinish && !availableOptions.some(opt => opt.value === selectedFinish)) {
          onFinishChange(availableOptions[0].value);
        }
      }
    }
  }, [finishImages, selectedFinish, onFinishChange]);

  const handleFinishSelection = (value: string) => (e: React.MouseEvent) => {
    // Prevent the event from propagating up to any parent elements
    e.preventDefault();
    e.stopPropagation();
    
    // Update the selected finish
    onFinishChange(value);
  };

  const optionsGrid = (
    <div className={`grid grid-cols-2 gap-4 ${isMobile ? 'pb-24' : 'pb-6'}`}>
      {finishOptions.map(finish => (
        <button
          key={finish.value}
          onClick={handleFinishSelection(finish.value)}
          type="button" // Explicitly set type to prevent form submission
          className={`
            flex items-center gap-3 p-3 border transition-all w-full
            ${selectedFinish === finish.value 
              ? "bg-[#1A3174] text-white border-[#1A3174]" 
              : "bg-white text-[#0A0B3B] border-gray-200 hover:border-[#1A3174]/30"
            }
            ${isMobile ? 'rounded-md' : ''}
          `}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-gray-200 border-t-[#1A3174] rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={finishImages[finish.value] || '/placeholder.svg'}
                alt={finish.label}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  console.error(`Failed to load image for ${finish.value}`, finishImages[finish.value]);
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            )}
          </div>
          <span className="font-medium text-left text-sm">
            {finish.label}
          </span>
        </button>
      ))}
    </div>
  );

  return (
    <div className={`flex flex-col h-full ${isMobile ? 'px-2 pb-8' : ''}`}>
      <h2 className="text-2xl font-bold text-[#1A3174] mb-6">
        Garage Finish
      </h2>
      
      {isMobile ? (
        <div className="flex-1">
          {optionsGrid}
        </div>
      ) : (
        <div className="overflow-y-auto">
          {optionsGrid}
        </div>
      )}
    </div>
  );
}
