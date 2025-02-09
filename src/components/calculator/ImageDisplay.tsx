
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function ImageDisplay({ totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const { toast } = useToast();

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
              if (options.needStemWalls === 'no') {
                imageData = { image_path: finishCollection.stem_wall_no_image };
              } else if (options.needStemWalls === 'yes' && !options.stemWallType) {
                imageData = { image_path: finishCollection.stemwall_yes_image };
              } else if (options.stemWallType === 'standard') {
                imageData = { image_path: finishCollection.stem_wall_standard_image };
              } else if (options.stemWallType === 'large') {
                imageData = { image_path: finishCollection.stem_wall_large_image };
              }
            } else if (step === 6) {
              imageData = {
                image_path: options.needSteps === 'yes' 
                  ? finishCollection.steps_yes_image 
                  : finishCollection.steps_no_image
              };
            }
          }
        } else if (step === 4 && options?.garageFinish) {
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
          // Handle all extra footage scenarios
          let imageType = 'no-extra-footage';

          if (options?.needExtraFootage === 'yes') {
            if (options?.extraFootage) {
              // Use specific footage range image
              imageType = options.extraFootage;
              console.log('Step 7: Using specific footage range:', imageType);
            } else {
              // Default "yes" image before selecting footage range
              imageType = 'yes-extra-footage';
              console.log('Step 7: Using default yes image');
            }
          }

          console.log('Step 7: Fetching image for type:', imageType);
          
          const { data: stepImage, error: stepError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', 7)
            .eq('image_type', imageType)
            .maybeSingle();

          if (stepError) {
            console.error('Error fetching step 7 image:', stepError);
            throw stepError;
          }

          imageData = stepImage;
          console.log('Step 7: Found image:', imageData);
        } else if (step === 8) {
          const imageType = options?.currentCondition || 'original';
          console.log('Step 8: Fetching image for condition:', imageType);
          
          const { data: stepImage, error: stepError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', 8)
            .eq('image_type', imageType)
            .maybeSingle();

          if (stepError) {
            console.error('Error fetching step 8 image:', stepError);
            throw stepError;
          }
          
          imageData = stepImage;
          console.log('Step 8: Found image:', imageData);
        } else {
          // For steps 1,2,3, fetch default images
          const { data: stepImage, error: stepError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', step)
            .eq('image_type', 'default')
            .maybeSingle();

          if (stepError) throw stepError;
          imageData = stepImage;
        }

        if (imageData?.image_path) {
          console.log(`Setting image for step ${step}:`, imageData.image_path);
          setCurrentImageSrc(imageData.image_path);
        } else {
          console.error(`No image found for step ${step} with options:`, {
            step,
            options,
            imageData
          });
          setImageError(true);
          toast({
            title: "Image not found",
            description: "The image for this step could not be loaded.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in loadImage:', error);
        setImageError(true);
        toast({
          title: "Error loading image",
          description: "There was a problem loading the image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [step, options?.garageFinish, options?.needStemWalls, options?.stemWallType, 
      options?.needSteps, options?.needExtraFootage, options?.extraFootage, 
      options?.currentCondition, toast]);

  const containerHeight = isMobile ? "h-[300px]" : "h-[600px]";

  return (
    <div className={`relative ${containerHeight}`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3174]"></div>
        </div>
      ) : currentImageSrc && !imageError ? (
        <img
          src={currentImageSrc}
          alt={`Step ${step} visualization`}
          className={`w-full rounded-lg shadow-lg object-cover ${containerHeight}`}
          onError={() => {
            console.error('Image failed to load:', currentImageSrc);
            setImageError(true);
            toast({
              title: "Image load failed",
              description: "The image could not be displayed.",
              variant: "destructive",
            });
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
