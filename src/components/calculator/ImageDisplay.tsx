
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ImageDisplay({ totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setImageError(false);
      
      try {
        let imageType = 'default';
        
        if (step === 4 && options?.garageFinish) {
          imageType = `finish_${options.garageFinish}`;
        } else if (step === 5 && options?.needStemWalls) {
          if (options.needStemWalls === 'no') {
            imageType = 'stemwalls_no';
          } else if (options.stemWallType && typeof options.stemWallType === 'string') {
            imageType = `stemwalls_${options.stemWallType}`;
          }
        } else if (step === 6 && options?.needSteps) {
          imageType = `steps_${options.needSteps}`;
        }

        console.log('Loading image with options:', { step, options });

        const { data: imageData, error } = await supabase
          .from('calculator_step_images')
          .select('image_path')
          .eq('step_number', step)
          .eq('image_type', imageType)
          .maybeSingle();

        if (error) {
          console.error('Error fetching image:', error);
          throw error;
        }

        if (imageData) {
          console.log('Found image data:', imageData);
          setCurrentImageSrc(imageData.image_path);
        } else {
          console.log('No image data found, falling back to default');
          // Fallback to default image for the step
          const { data: defaultImage } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', step)
            .eq('image_type', 'default')
            .maybeSingle();
            
          if (defaultImage) {
            setCurrentImageSrc(defaultImage.image_path);
          }
        }
      } catch (error) {
        console.error('Error in loadImage:', error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [step, options]);

  return (
    <div className="relative">
      {currentImageSrc && !imageError && (
        <img
          src={currentImageSrc}
          alt={`Step ${step} visualization`}
          className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          } ${isMobile ? "h-[300px]" : "h-[600px]"}`}
          onError={() => {
            console.error('Image failed to load:', currentImageSrc);
            setImageError(true);
          }}
        />
      )}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Image failed to load</p>
        </div>
      )}
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
