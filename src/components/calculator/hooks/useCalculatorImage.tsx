
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
      setCurrentImageSrc(""); // Reset the image source before loading new one
      
      try {
        let imageData = null;
        
        if (step === 8 && options?.currentCondition) {
          console.log('Step 8 - Loading image for condition:', options.currentCondition);
          
          imageData = await imageUtils.handleConditionImage(options.currentCondition);
          
          if (!imageData) {
            const { data, error } = await supabase
              .from('calculator_step_images')
              .select('image_path')
              .eq('step_number', 8)
              .eq('image_type', options.currentCondition)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching condition image:', error);
              throw error;
            }
            
            if (data) {
              imageData = data;
              console.log('Found image for condition:', data);
            }
          }
        } else if (step === 7) {
          console.log('Step 7 - Loading image for extra footage:', options?.needExtraFootage, options?.extraFootage);
          
          imageData = await imageUtils.handleExtraFootageImage(options || {});
          
          if (!imageData) {
            let imageType = 'default';
            if (options?.needExtraFootage === 'no') {
              imageType = 'no';
            } else if (options?.needExtraFootage === 'yes') {
              if (options?.extraFootage) {
                imageType = options.extraFootage;
              } else {
                imageType = 'yes';
              }
            }
            
            console.log('Using image type for step 7:', imageType);
            
            const { data, error } = await supabase
              .from('calculator_step_images')
              .select('image_path')
              .eq('step_number', 7)
              .eq('image_type', imageType)
              .maybeSingle();
            
            if (error) {
              console.error('Error fetching extra footage image:', error);
              throw error;
            }
            
            if (data) {
              imageData = data;
              console.log('Found image for extra footage:', data);
            }
          }
        } else if ((step === 5 || step === 6) && options?.garageFinish) {
          console.log('Fetching finish collection for', options.garageFinish);
          const finishCollection = await db.getFinishCollectionImage(options.garageFinish);
          
          if (finishCollection) {
            console.log('Found finish collection:', finishCollection.id);
            if (step === 5) {
              imageData = await imageUtils.handleStemWallImage(finishCollection, options);
            } else if (step === 6) {
              imageData = await imageUtils.handleStepsImage(finishCollection, options.needSteps || 'no');
            }
          } else {
            console.log('No finish collection found for', options.garageFinish);
          }
        } else if (step === 4 && options?.garageFinish) {
          console.log('Step 4 - Garage Finish:', options.garageFinish);
          const result = await imageUtils.storeGarageFinishImage(options.garageFinish);
          
          if (result) {
            imageData = { image_path: result.image_path };
            console.log('Found garage finish image:', result.image_path);
          }
        } else if (step === 9) {
          console.log('Step 9 - Payment, getting last selected stem wall image');
          imageData = await db.getLastSelectedImage(5);
        } else {
          // For all other steps, get the default image
          console.log('Getting default image for step:', step);
          imageData = await db.getStepImage(step, 'default');
        }

        if (!isMounted) return;

        if (imageData?.image_path) {
          console.log('Setting new image source:', imageData.image_path);
          setCurrentImageSrc(imageData.image_path);
        } else {
          console.log('No image path found for step:', step);
          setImageError(true);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error in loadImage:', error);
        setImageError(true);
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
      options?.needSteps, options?.currentCondition, options?.needExtraFootage, 
      options?.extraFootage, toast]);

  return { isLoading, imageError, currentImageSrc, setImageError };
}
