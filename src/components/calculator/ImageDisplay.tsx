
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSrc);

  useEffect(() => {
    const loadImage = async () => {
      try {
        // For steps 1-3, use new default images
        if (step === 1) {
          setCurrentImageSrc('/lovable-uploads/27bef253-bd78-4bf1-ae5f-5e580e60c21a.png');
          return;
        } else if (step === 2) {
          setCurrentImageSrc('/lovable-uploads/40e4b96a-7407-4e11-a29c-ae777c505c2a.png');
          return;
        } else if (step === 3) {
          setCurrentImageSrc('/lovable-uploads/df962712-ee4f-4d54-931c-000bf94d6296.png');
          return;
        }

        // For steps 4-6, fetch from database
        if (step >= 4 && step <= 6 && options?.garageFinish) {
          const { data: imageDataArray, error } = await supabase
            .from('garage_finish_image_collections')
            .select('garage_finish_image, stem_wall_standard_image, stem_wall_large_image, stem_wall_no_image, steps_yes_image, steps_no_image')
            .eq('finish_type', options.garageFinish)
            .limit(1);

          if (error) {
            console.error('Supabase query error:', error);
            throw error;
          }

          if (imageDataArray && imageDataArray.length > 0) {
            const imageData = imageDataArray[0];
            console.log('Image data found:', imageData);

            if (step === 4) {
              setCurrentImageSrc(imageData.garage_finish_image);
            } else if (step === 5) {
              if (options.needStemWalls === 'no') {
                setCurrentImageSrc(imageData.stem_wall_no_image);
              } else if (options.stemWallType === 'standard') {
                setCurrentImageSrc(imageData.stem_wall_standard_image);
              } else if (options.stemWallType === 'large') {
                setCurrentImageSrc(imageData.stem_wall_large_image);
              }
            } else if (step === 6) {
              setCurrentImageSrc(options.needSteps === 'yes' ? imageData.steps_yes_image : imageData.steps_no_image);
            }
          } else {
            console.error('No image data found for finish type:', options.garageFinish);
            throw new Error('No image data found');
          }
        }
        // For step 7
        else if (step === 7) {
          setCurrentImageSrc('/lovable-uploads/df962712-ee4f-4d54-931c-000bf94d6296.png');
        }
        // For step 8, show different images based on current condition
        else if (step === 8) {
          if (options?.currentCondition === 'original') {
            setCurrentImageSrc('/lovable-uploads/27bef253-bd78-4bf1-ae5f-5e580e60c21a.png');
          } else {
            setCurrentImageSrc('/lovable-uploads/40e4b96a-7407-4e11-a29c-ae777c505c2a.png');
          }
        }
        // Default image for other steps
        else {
          setCurrentImageSrc('/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png');
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setImageError(true);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    setImageError(false);
    loadImage();
  }, [step, options, imageSrc]);

  useEffect(() => {
    console.log('Current Image:', currentImageSrc);
    console.log('Step:', step);
    console.log('Options:', options);
  }, [currentImageSrc, step, options]);

  const handleImageError = () => {
    console.error('Image failed to load:', currentImageSrc);
    setImageError(true);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading image...</p>
        </div>
      )}
      <img
        src={currentImageSrc}
        alt={`Step ${step} visualization`}
        className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } ${isMobile ? "h-[300px]" : "h-[600px]"}`}
        onError={handleImageError}
      />
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Image failed to load. Please try again.</p>
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
