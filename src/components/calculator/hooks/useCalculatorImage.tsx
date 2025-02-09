
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
              if (options.needStemWalls === 'no') {
                imageData = { image_path: finishCollection.stem_wall_no_image };
              } else if (options.needStemWalls === 'yes' && !options.stemWallType) {
                imageData = { image_path: finishCollection.stemwall_yes_image };
              } else if (options.stemWallType === 'standard') {
                imageData = { image_path: finishCollection.stem_wall_standard_image };
              } else if (options.stemWallType === 'large') {
                imageData = { image_path: finishCollection.stem_wall_large_image };
              }

              // Update all images for step 5 to not be last selected
              const { error: updateError } = await supabase
                .from('calculator_step_images')
                .update({ is_last_selected: false })
                .eq('step_number', 5);

              if (updateError) throw updateError;

              // Insert the new last selected image
              let imageType = 'stem-wall-no';
              if (options.needStemWalls === 'yes') {
                imageType = options.stemWallType ? `stem-wall-${options.stemWallType}` : 'stem-wall-yes';
              }

              const { error: insertError } = await supabase
                .from('calculator_step_images')
                .insert({
                  step_number: 5,
                  image_type: imageType,
                  image_path: imageData?.image_path,
                  is_last_selected: true
                });

              if (insertError) throw insertError;
            } else if (step === 6) {
              const imagePath = options.needSteps === 'yes' 
                ? finishCollection.steps_yes_image 
                : finishCollection.steps_no_image;

              imageData = { image_path: imagePath };
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
          imageData = lastSelectedImage;
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
