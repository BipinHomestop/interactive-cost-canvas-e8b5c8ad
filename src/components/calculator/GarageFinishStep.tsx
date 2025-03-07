
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

const GARAGE_FINISHES = [{
  value: "snowfall",
  label: "Snowfall (Most Popular)"
}, {
  value: "granite",
  label: "Granite"
}, {
  value: "slate",
  label: "Slate"
}, {
  value: "modern",
  label: "Modern"
}, {
  value: "minimal",
  label: "Minimal"
}, {
  value: "glass",
  label: "Glass"
}, {
  value: "classic",
  label: "Classic"
}, {
  value: "premium",
  label: "Premium"
}, {
  value: "deluxe",
  label: "Deluxe"
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
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadOptionImages = async () => {
      try {
        const { data: images, error } = await supabase
          .from('calculator_step_images')
          .select('image_type, image_path')
          .eq('step_number', 4)
          .like('image_type', 'option-%');

        if (error) throw error;

        const imageMap = images.reduce((acc: Record<string, string>, img) => {
          const finishType = img.image_type.replace('option-', '');
          acc[finishType] = img.image_path;
          return acc;
        }, {});

        setFinishImages(imageMap);
        
        // Initialize all images as not loaded
        const initialLoadState = Object.keys(imageMap).reduce((acc: Record<string, boolean>, key) => {
          acc[key] = false;
          return acc;
        }, {});
        setLoadedImages(initialLoadState);
      } catch (error) {
        console.error('Error loading finish images:', error);
      }
    };

    loadOptionImages();
  }, []);

  const handleImageLoad = (finishType: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [finishType]: true
    }));
  };

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
            {!loadedImages[finish.value] && finishImages[finish.value] && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-[#1A3174] rounded-full animate-spin"></div>
              </div>
            )}
            {finishImages[finish.value] ? (
              <img
                src={finishImages[finish.value]}
                alt={finish.label}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loadedImages[finish.value] ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(finish.value)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">Loading</span>
              </div>
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
