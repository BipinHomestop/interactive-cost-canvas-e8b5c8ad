
import { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "../types";
import * as db from "./utils/databaseQueries";
import * as imageUtils from "./utils/imageUtils";
import { supabase } from "@/integrations/supabase/client";

// Create an image cache to reduce redundant loading
const imageCache = new Map<string, string>();

export function useCalculatorImage(step: number, options?: Partial<CalculatorInputs>) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const { toast } = useToast();
  const isMounted = useRef(true);

  // Generate a cache key from step and relevant options
  const getCacheKey = useCallback(() => {
    let key = `step-${step}`;
    
    if (step === 8 && options?.currentCondition) {
      key += `-condition-${options.currentCondition}`;
    } else if (step === 7) {
      key += `-extraFootage-${options?.needExtraFootage || 'no'}-${options?.extraFootage || ''}`;
    } else if ((step === 5 || step === 6) && options?.garageFinish) {
      key += `-finish-${options.garageFinish}`;
      if (step === 5) {
        key += `-stemWalls-${options?.needStemWalls || 'no'}-${options?.stemWallType || ''}`;
      } else if (step === 6) {
        key += `-steps-${options?.needSteps || 'no'}`;
      }
    } else if (step === 4 && options?.garageFinish) {
      key += `-finish-${options.garageFinish}`;
    }
    
    return key;
  }, [step, options]);

  // Prefetch the next step's image
  const prefetchNextStepImage = useCallback(async () => {
    if (step < 9) {
      try {
        const nextStepKey = `step-${step + 1}`;
        if (!imageCache.has(nextStepKey)) {
          const nextStepImage = await db.getStepImage(step + 1, 'default');
          if (nextStepImage?.image_path) {
            imageCache.set(nextStepKey, nextStepImage.image_path);
            // Preload the image
            const img = new Image();
            img.src = nextStepImage.image_path;
          }
        }
      } catch (error) {
        console.log('Error prefetching next step image:', error);
      }
    }
  }, [step]);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadImage = async () => {
      if (!isMounted.current) return;
      
      console.log('Loading image for step:', step, 'with options:', options);
      setIsLoading(true);
      setImageError(false);
      
      try {
        const cacheKey = getCacheKey();
        let imagePath = imageCache.get(cacheKey);
        
        if (!imagePath) {
          let imageData = null;
          
          if (step === 8 && options?.currentCondition) {
            console.log('Step 8 - Loading image for condition:', options.currentCondition);
            
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
          } else if (step === 7) {
            console.log('Step 7 - Loading image for extra footage:', options?.extraFootage);
            
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
          } else if ((step === 5 || step === 6) && options?.garageFinish) {
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
          } else {
            // For all other steps, get the default image
            imageData = await db.getStepImage(step, 'default');
          }

          if (!isMounted.current) return;

          if (imageData?.image_path) {
            imagePath = imageData.image_path;
            imageCache.set(cacheKey, imagePath);
          } else {
            console.log('No image path found for step:', step);
            setImageError(true);
          }
        }
        
        if (imagePath) {
          console.log('Setting image source:', imagePath);
          setCurrentImageSrc(imagePath);
          
          // Try to prefetch the next step's image
          prefetchNextStepImage();
        }
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error in loadImage:', error);
        setImageError(true);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    loadImage();
  }, [step, options?.garageFinish, options?.needStemWalls, options?.stemWallType, 
      options?.needSteps, options?.currentCondition, options?.needExtraFootage, 
      options?.extraFootage, toast, getCacheKey, prefetchNextStepImage]);

  return { isLoading, imageError, currentImageSrc, setImageError };
}
