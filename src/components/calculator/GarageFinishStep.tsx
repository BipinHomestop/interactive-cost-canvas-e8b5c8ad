
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
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadOptionImages = async () => {
      setIsLoading(true);
      setFinishImages({}); // Reset images to force refresh
      
      try {
        console.log('Fetching finish option images from step 4...');
        
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

        console.log('Received images data:', images);

        if (!images || images.length === 0) {
          console.warn('No images found for step 4 with option- prefix');
          toast({
            title: "No finish options found",
            description: "Could not find any finish option images in the database.",
            variant: "destructive"
          });
          return;
        }

        const imageMap = images.reduce((acc: Record<string, string>, img) => {
          const finishType = img.image_type.replace('option-', '');
          acc[finishType] = img.image_path;
          console.log(`Mapped ${img.image_type} -> ${finishType}: ${img.image_path}`);
          return acc;
        }, {});

        console.log('Finish images mapping:', imageMap);
        setFinishImages(imageMap);
      } catch (error) {
        console.error('Error in loadOptionImages:', error);
        toast({
          title: "Error processing images",
          description: "There was a problem processing the finish option images.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOptionImages();
  }, []); // Empty dependency array to run once on mount

  const optionsGrid = (
    <div className={`grid grid-cols-2 gap-4 ${isMobile ? 'pb-24' : 'pb-6'}`}>
      {GARAGE_FINISHES.map(finish => (
        <button
          key={finish.value}
          onClick={() => onFinishChange(finish.value)}
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
                  console.error(`Failed to load image for ${finish.value}`);
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
