
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps, StepImages, GarageFinishImages } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const STEP_IMAGES: StepImages = {
  1: "/lovable-uploads/68de81cd-8ab3-48fb-a096-8672f01e69ae.png",
  2: "/lovable-uploads/5b5c0d70-9ee6-4985-b1a1-52cc2ce3c41d.png",
  3: "/lovable-uploads/efd78ab5-d4dc-4b0b-9124-b9047ba316af.png",
  8: {
    original: "/lovable-uploads/cf6b538a-e34d-4762-9965-adcf1ec139a5.png",
    existing: "/lovable-uploads/3840b81a-a546-4328-8f6e-5461f8d4a263.png"
  }
};

// Preload images function
const preloadImages = (images: string[]) => {
  images.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string>(imageSrc);
  const [finishImages, setFinishImages] = useState<GarageFinishImages[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('garage_finish_image_collections')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setFinishImages(data);
          // Preload all images from the collections
          data.forEach((collection) => {
            preloadImages([
              collection.garage_finish_image,
              collection.stem_wall_standard_image,
              collection.stem_wall_large_image,
              collection.stem_wall_no_image,
              collection.steps_yes_image,
              collection.steps_no_image,
            ]);
          });
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        toast({
          title: "Error",
          description: "Failed to load images",
          variant: "destructive",
        });
      }
    };

    fetchImages();
  }, [toast]);

  useEffect(() => {
    setIsLoading(true);
    const newImage = getImageSource();
    const img = new Image();
    img.src = newImage;
    img.onload = () => {
      setCurrentImage(newImage);
      setIsLoading(false);
    };
  }, [step, options, finishImages]);

  const getImageSource = (): string => {
    if (step <= 3) {
      return STEP_IMAGES[step] as string || imageSrc;
    }
    
    if (step === 4 && options?.garageFinish) {
      const selectedFinishImages = finishImages.find(
        collection => collection.finish_type === options.garageFinish
      );
      return selectedFinishImages?.garage_finish_image || imageSrc;
    }
    
    if (step === 5) {
      const selectedFinishImages = options?.garageFinish ? 
        finishImages.find(collection => collection.finish_type === options.garageFinish) : 
        null;

      if (options?.needStemWalls === 'yes' && options?.stemWallType) {
        return options.stemWallType === 'standard' 
          ? selectedFinishImages?.stem_wall_standard_image || imageSrc
          : selectedFinishImages?.stem_wall_large_image || imageSrc;
      }
      if (options?.needStemWalls === 'no') {
        return selectedFinishImages?.stem_wall_no_image || imageSrc;
      }
    }
    
    if (step === 6 && options?.needSteps) {
      const selectedFinishImages = options?.garageFinish ? 
        finishImages.find(collection => collection.finish_type === options.garageFinish) : 
        null;

      return options.needSteps === 'yes'
        ? selectedFinishImages?.steps_yes_image || imageSrc
        : selectedFinishImages?.steps_no_image || imageSrc;
    }

    if (step === 8 && options?.currentCondition) {
      const stepImages = STEP_IMAGES[8] as Record<string, string>;
      return stepImages[options.currentCondition];
    }
    
    return imageSrc;
  };
  
  return (
    <div className="relative">
      <img
        src={currentImage}
        alt={`Step ${step} visualization`}
        className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } ${isMobile ? "h-[300px]" : "h-[600px]"}`}
      />
      {step >= 3 && (
        <div className="absolute bottom-0 left-0 right-0 bg-[#0A0B3B] text-white p-4 rounded-b-lg">
          <div className="text-2xl font-bold">
            Your Price: ${totalCost.toLocaleString()}
          </div>
          <div className="text-[#FFA500]">
            Market Price: ${Math.round(totalCost * 1.4).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
