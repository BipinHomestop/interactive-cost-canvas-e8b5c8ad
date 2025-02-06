
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSrc);

  useEffect(() => {
    const loadImage = async () => {
      if (step === 4 && options?.garageFinish) {
        const { data: imageDataArray } = await supabase
          .from('garage_finish_image_collections')
          .select('garage_finish_image')
          .eq('finish_type', options.garageFinish)
          .limit(1);
        
        if (imageDataArray && imageDataArray.length > 0) {
          setCurrentImageSrc(imageDataArray[0].garage_finish_image);
        }
      } else if (step === 5 && options?.needStemWalls) {
        const { data: imageDataArray } = await supabase
          .from('garage_finish_image_collections')
          .select('stem_wall_standard_image, stem_wall_large_image, stem_wall_no_image')
          .eq('finish_type', options?.garageFinish || 'snowfall')
          .limit(1);
        
        if (imageDataArray && imageDataArray.length > 0) {
          const imageData = imageDataArray[0];
          if (options.needStemWalls === 'no') {
            setCurrentImageSrc(imageData.stem_wall_no_image);
          } else if (options.stemWallType === 'standard') {
            setCurrentImageSrc(imageData.stem_wall_standard_image);
          } else if (options.stemWallType === 'large') {
            setCurrentImageSrc(imageData.stem_wall_large_image);
          }
        }
      } else if (step === 6 && options?.needSteps) {
        const { data: imageDataArray } = await supabase
          .from('garage_finish_image_collections')
          .select('steps_yes_image, steps_no_image')
          .eq('finish_type', options?.garageFinish || 'snowfall')
          .limit(1);
        
        if (imageDataArray && imageDataArray.length > 0) {
          const imageData = imageDataArray[0];
          setCurrentImageSrc(options.needSteps === 'yes' ? imageData.steps_yes_image : imageData.steps_no_image);
        }
      } else {
        setCurrentImageSrc(imageSrc);
      }
    };

    setIsLoading(true);
    loadImage()
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [step, options, imageSrc]);

  return (
    <div className="relative">
      <img
        src={currentImageSrc}
        alt={`Step ${step} visualization`}
        className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } ${isMobile ? "h-[300px]" : "h-[600px]"}`}
        onError={() => setImageError(true)}
      />
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
