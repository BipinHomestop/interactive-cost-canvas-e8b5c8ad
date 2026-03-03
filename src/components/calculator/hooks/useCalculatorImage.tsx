
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "../types";
import * as db from "./utils/databaseQueries";
import * as imageUtils from "./utils/imageUtils";
import { supabase } from "@/integrations/supabase/client";
import { getCachedImage, setCachedImage } from "@/hooks/calculator/use-image-preloader";
import { getFallbackImage } from "./utils/fallbackImages";

// Simple in-memory cache for database queries
const queryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCachedQuery = (key: string) => {
  const cached = queryCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedQuery = (key: string, data: any) => {
  queryCache.set(key, { data, timestamp: Date.now() });
};

export function useCalculatorImage(step: number, options?: Partial<CalculatorInputs>) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>("");
  const { toast } = useToast();
  const abortController = useRef<AbortController | null>(null);

  useEffect(() => {
    // Cancel any pending request
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();
    
    let isMounted = true;

    const useFallback = () => {
      if (!isMounted) return;
      const fallback = getFallbackImage(step, options);
      if (fallback) {
        console.log('Using fallback image for step:', step);
        setCurrentImageSrc(fallback);
        setIsLoading(false);
      } else {
        setImageError(true);
        setIsLoading(false);
      }
    };

    const loadImage = async () => {
      if (!isMounted) return;
      
      // Check cache first for quick display
      const cacheKey = `step-${step}-${JSON.stringify(options)}`;
      const cachedSrc = getCachedImage(cacheKey);
      if (cachedSrc) {
        setCurrentImageSrc(cachedSrc);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setImageError(false);
      
      try {
        let imageData = null;
        
        if (step === 8 && options?.currentCondition) {
          const queryCacheKey = `step8-${options.currentCondition}`;
          const cached = getCachedQuery(queryCacheKey);
          
          if (cached) {
            imageData = cached;
          } else {
            const { data, error } = await supabase
              .from('calculator_step_images')
              .select('image_path')
              .eq('step_number', 8)
              .eq('image_type', options.currentCondition)
              .maybeSingle();
            
            if (error) throw error;
            if (data) {
              imageData = data;
              setCachedQuery(queryCacheKey, data);
            }
          }
        } else if (step === 7) {
          let imageType = 'default';
          if (options?.needExtraFootage === 'no') {
            imageType = 'no';
          } else if (options?.needExtraFootage === 'yes') {
            imageType = options?.extraFootage || 'yes';
          }
          
          const queryCacheKey = `step7-${imageType}`;
          const cached = getCachedQuery(queryCacheKey);
          
          if (cached) {
            imageData = cached;
          } else {
            const { data, error } = await supabase
              .from('calculator_step_images')
              .select('image_path')
              .eq('step_number', 7)
              .eq('image_type', imageType)
              .maybeSingle();
            
            if (error) throw error;
            if (data) {
              imageData = data;
              setCachedQuery(queryCacheKey, data);
            }
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
        } else if (step === 9 && options?.garageFinish) {
          const finishCollection = await db.getFinishCollectionImage(options.garageFinish);
          if (finishCollection) {
            if (options.needStemWalls === 'no') {
              imageData = { image_path: finishCollection.stem_wall_no_image };
            } else if (options.stemWallType === 'large') {
              imageData = { image_path: finishCollection.stem_wall_large_image };
            } else {
              imageData = { image_path: finishCollection.stem_wall_standard_image };
            }
          }
        } else {
          // Check for default image in cache
          const defaultCacheKey = `step-${step}-default`;
          const cachedDefault = getCachedImage(defaultCacheKey);
          if (cachedDefault) {
            if (isMounted) {
              setCurrentImageSrc(cachedDefault);
              setIsLoading(false);
            }
            return;
          }
          imageData = await db.getStepImage(step, 'default');
        }

        if (!isMounted) return;

        if (imageData?.image_path) {
          setCurrentImageSrc(imageData.image_path);
          setCachedImage(cacheKey, imageData.image_path);
        } else {
          // No data from DB — use fallback
          useFallback();
        }
      } catch (error) {
        if (!isMounted) return;
        console.warn('DB fetch failed for step', step, '- using fallback:', error);
        useFallback();
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
      options?.extraFootage]);

  return { isLoading, imageError, currentImageSrc, setImageError };
}
