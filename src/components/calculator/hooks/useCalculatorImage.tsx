
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "../types";
import * as db from "./utils/databaseQueries";
import * as imageUtils from "./utils/imageUtils";

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
          imageData = await db.getStepImage(8, imageType);
          console.log('Step 8 image data:', imageData); // Debug log
        } else {
          imageData = await db.getStepImage(step, 'default');
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
      options?.needSteps, options?.currentCondition, toast]);

  return { isLoading, imageError, currentImageSrc, setImageError };
}
