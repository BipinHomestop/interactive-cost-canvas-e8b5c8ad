
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
        let imageData;
        
        // For steps 5 and 6, fetch from garage_finish_image_collections
        if ((step === 5 || step === 6) && options?.garageFinish) {
          const { data: finishCollection, error: finishError } = await supabase
            .from('garage_finish_image_collections')
            .select('*')
            .eq('finish_type', options.garageFinish)
            .maybeSingle();

          if (finishError) throw finishError;

          if (finishCollection) {
            if (step === 5) {
              // Handle stem walls images
              if (options.needStemWalls === 'no') {
                imageData = { image_path: finishCollection.stem_wall_no_image };
              } else if (options.stemWallType === 'standard') {
                imageData = { image_path: finishCollection.stem_wall_standard_image };
              } else if (options.stemWallType === 'large') {
                imageData = { image_path: finishCollection.stem_wall_large_image };
              }
            } else if (step === 6) {
              // Handle steps images
              imageData = {
                image_path: options.needSteps === 'yes' 
                  ? finishCollection.steps_yes_image 
                  : finishCollection.steps_no_image
              };
            }
          }
        } else if (step === 4 && options?.garageFinish) {
          // For step 4, fetch from garage_finish_image_collections
          const { data: finishCollection, error: finishError } = await supabase
            .from('garage_finish_image_collections')
            .select('garage_finish_image')
            .eq('finish_type', options.garageFinish)
            .maybeSingle();

          if (finishError) throw finishError;
          
          if (finishCollection) {
            imageData = { image_path: finishCollection.garage_finish_image };
          }
        } else if (step === 7) {
          // Handle extra footage images based on selection
          let imageType = options?.needExtraFootage === 'no' 
            ? 'no-extra-footage' 
            : options?.extraFootage || '';

          if (imageType) {
            const { data: stepImage, error: stepError } = await supabase
              .from('calculator_step_images')
              .select('image_path')
              .eq('step_number', step)
              .eq('image_type', imageType)
              .maybeSingle();

            if (stepError) throw stepError;
            imageData = stepImage;
          }
        } else {
          // For other steps, fetch from calculator_step_images
          let imageType = 'default';
          
          if (step === 8 && options?.currentCondition) {
            imageType = options.currentCondition;
          }

          const { data: stepImage, error: stepError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', step)
            .eq('image_type', imageType)
            .maybeSingle();

          if (stepError) throw stepError;
          imageData = stepImage;
        }

        if (imageData) {
          console.log('Setting image:', imageData.image_path);
          setCurrentImageSrc(imageData.image_path);
        } else {
          console.log('No image found for:', { step, options });
          setImageError(true);
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

  const containerHeight = isMobile ? "h-[300px]" : "h-[600px]";

  return (
    <div className={`relative ${containerHeight}`}>
      {currentImageSrc && !imageError ? (
        <img
          src={currentImageSrc}
          alt={`Step ${step} visualization`}
          className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-50' : 'opacity-100'
          } ${containerHeight}`}
          onError={() => {
            console.error('Image failed to load:', currentImageSrc);
            setImageError(true);
          }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Image not available</p>
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
