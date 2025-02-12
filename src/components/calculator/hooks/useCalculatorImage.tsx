
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "../types";
import * as db from "./utils/databaseQueries";
import * as imageUtils from "./utils/imageUtils";
import { supabase } from "@/integrations/supabase/client";

export function useCalculatorImage(step: number, options?: Partial<CalculatorInputs>) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      if (!isMounted) return;
      
      console.log('Loading image for step:', step, 'with options:', options);
      setIsLoading(true);
      setImageError(false);
      
      try {
        let imageData;
        
        if ((step === 5 || step === 6) && options?.garageFinish) {
          const finishCollection = await db.getFinishCollectionImage(options.garageFinish);
          
          if (finishCollection) {
            if (step === 5) {
              imageData = await imageUtils.handleStemWallImage(finishCollection, options);
            } else if (step === 6) {
              imageData = imageUtils.handleStepsImage(finishCollection, options.needSteps || 'no');
            }
          }
        } else if (step === 4 && options?.garageFinish) {
          const finishCollection = await db.getFinishCollectionImage(options.garageFinish);
          if (finishCollection) {
            imageData = { image_path: finishCollection.garage_finish_image };
          }
        } else if (step === 9) {
          imageData = await db.getLastSelectedImage(5);
        } else if (step === 8) {
          const imageType = options?.currentCondition || 'original';
          console.log('Step 8 - Loading image for condition:', imageType);
          
          const { data, error } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', 8)
            .eq('image_type', imageType)
            .maybeSingle();

          if (error) {
            console.error('Error fetching step image:', error);
            throw error;
          }
          
          imageData = data;
          console.log('Step 8 - Retrieved image data:', imageData);
        } else {
          imageData = await db.getStepImage(step, 'default');
        }

        if (!isMounted) return;

        if (imageData?.image_path) {
          console.log('Setting new image source:', imageData.image_path);
          setCurrentImageSrc(imageData.image_path);
        } else {
          console.error('No image path found in imageData:', imageData);
          setImageError(true);
          toast({
            title: "Image not found",
            description: "The image for this step could not be loaded.",
            variant: "destructive",
          });
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error in loadImage:', error);
        setImageError(true);
        toast({
          title: "Error loading image",
          description: "There was a problem loading the image. Please try again.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [step, options?.garageFinish, options?.needStemWalls, options?.stemWallType, 
      options?.needSteps, options?.currentCondition, toast]);

  return { isLoading, imageError, currentImageSrc, setImageError };
}
