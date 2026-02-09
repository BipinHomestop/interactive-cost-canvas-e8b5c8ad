import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Cache for preloaded images
const imageCache = new Map<string, string>();
const preloadedUrls = new Set<string>();

// Preload an image and cache it
const preloadImage = (url: string): Promise<void> => {
  if (preloadedUrls.has(url)) return Promise.resolve();
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      preloadedUrls.add(url);
      resolve();
    };
    img.onerror = () => resolve(); // Don't block on errors
    img.src = url;
  });
};

// Get cached image or return the url
export const getCachedImage = (key: string): string | undefined => {
  return imageCache.get(key);
};

// Set cached image
export const setCachedImage = (key: string, url: string) => {
  imageCache.set(key, url);
  preloadImage(url);
};

export function useImagePreloader(currentStep: number, garageFinish?: string) {
  const hasPreloaded = useRef(false);
  
  useEffect(() => {
    // Only preload once on initial mount
    if (hasPreloaded.current) return;
    hasPreloaded.current = true;
    
    const preloadInitialImages = async () => {
      try {
        // Preload step 1-3 default images
        const { data: defaultImages } = await supabase
          .from('calculator_step_images')
          .select('step_number, image_path, image_type')
          .in('step_number', [1, 2, 3])
          .eq('image_type', 'default');
        
        if (defaultImages) {
          defaultImages.forEach(img => {
            setCachedImage(`step-${img.step_number}-default`, img.image_path);
          });
        }
        
        // Preload garage finish option thumbnails
        const { data: finishImages } = await supabase
          .from('calculator_step_images')
          .select('image_type, image_path')
          .eq('step_number', 4)
          .like('image_type', 'option-%');
        
        if (finishImages) {
          finishImages.forEach(img => {
            const finishType = img.image_type.replace('option-', '');
            setCachedImage(`finish-option-${finishType}`, img.image_path);
          });
        }
      } catch (error) {
        // Silently fail - preloading is optional
      }
    };
    
    preloadInitialImages();
  }, []);
  
  // Preload next step images when on a specific step
  useEffect(() => {
    if (!garageFinish) return;
    
    const preloadFinishImages = async () => {
      try {
        // Preload all images for the selected finish
        const { data: finishCollection } = await supabase
          .from('garage_finish_image_collections')
          .select('*')
          .eq('finish_type', garageFinish)
          .single();
        
        if (finishCollection) {
          // Cache all finish-related images
          setCachedImage(`finish-${garageFinish}-main`, finishCollection.garage_finish_image);
          setCachedImage(`finish-${garageFinish}-stemwall-standard`, finishCollection.stem_wall_standard_image);
          setCachedImage(`finish-${garageFinish}-stemwall-large`, finishCollection.stem_wall_large_image);
          setCachedImage(`finish-${garageFinish}-stemwall-no`, finishCollection.stem_wall_no_image);
          setCachedImage(`finish-${garageFinish}-steps-yes`, finishCollection.steps_yes_image);
          setCachedImage(`finish-${garageFinish}-steps-no`, finishCollection.steps_no_image);
        }
      } catch (error) {
        // Silently fail
      }
    };
    
    preloadFinishImages();
  }, [garageFinish]);
  
  // Preload condition images when approaching step 8
  useEffect(() => {
    if (currentStep < 6) return;
    
    const preloadConditionImages = async () => {
      try {
        const { data: conditionImages } = await supabase
          .from('calculator_step_images')
          .select('image_type, image_path')
          .eq('step_number', 8);
        
        if (conditionImages) {
          conditionImages.forEach(img => {
            setCachedImage(`condition-${img.image_type}`, img.image_path);
          });
        }
      } catch (error) {
        // Silently fail
      }
    };
    
    preloadConditionImages();
  }, [currentStep]);
}
