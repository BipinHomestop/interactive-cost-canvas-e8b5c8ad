
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "../types";

export function useCalculatorImage(step: number, options?: Partial<CalculatorInputs>) {
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
        
        if ((step === 5 || step === 6) && options?.garageFinish) {
          const { data: finishCollection, error: finishError } = await supabase
            .from('garage_finish_image_collections')
            .select('*')
            .eq('finish_type', options.garageFinish)
            .maybeSingle();

          if (finishError) throw finishError;

          if (finishCollection) {
            if (step === 5) {
              let selectedImage = '';
              let imageType = '';
              
              if (options.needStemWalls === 'no') {
                selectedImage = finishCollection.stem_wall_no_image;
                imageType = 'stem-wall-no';
              } else if (options.needStemWalls === 'yes' && !options.stemWallType) {
                selectedImage = finishCollection.stemwall_yes_image;
                imageType = 'stem-wall-yes';
              } else if (options.stemWallType === 'standard') {
                selectedImage = finishCollection.stem_wall_standard_image;
                imageType = 'stem-wall-standard';
              } else if (options.stemWallType === 'large') {
                selectedImage = finishCollection.stem_wall_large_image;
                imageType = 'stem-wall-large';
              }

              if (selectedImage) {
                imageData = { image_path: selectedImage };
                
                // Update the last selected image for step 5
                const { error: updateError } = await supabase
                  .from('calculator_step_images')
                  .update({ is_last_selected: true })
                  .eq('step_number', 5)
                  .eq('image_type', imageType);

                if (updateError) throw updateError;
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
        } else if (step === 9) {
          // For the finish step, get the last selected image from step 5
          const { data: lastSelectedImage, error: lastSelectedError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', 5)
            .eq('is_last_selected', true)
            .maybeSingle();

          if (lastSelectedError) throw lastSelectedError;
          
          if (lastSelectedImage) {
            imageData = lastSelectedImage;
          }
        } else if (step === 7) {
          let imageType = 'no-extra-footage';

          if (options?.needExtraFootage === 'yes') {
            imageType = options?.extraFootage || 'yes-extra-footage';
          }
          
          const { data: stepImage, error: stepError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', 7)
            .eq('image_type', imageType)
            .maybeSingle();

          if (stepError) throw stepError;
          imageData = stepImage;
        } else if (step === 8) {
          const imageType = options?.currentCondition || 'original';
          
          const { data: stepImage, error: stepError } = await supabase
            .from('calculator_step_images')
            .select('image_path')
            .eq('step_number', 8)
            .eq('image_type', imageType)
            .maybeSingle();

          if (stepError) throw stepError;
          imageData = stepImage;
        } else {
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
          setCurrentImageSrc(imageData.image_path);
        } else {
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

  return { isLoading, imageError, currentImageSrc, setImageError };
}
