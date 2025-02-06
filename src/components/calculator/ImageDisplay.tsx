
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
        setIsLoading(true);
        setImageError(false);
        
        // Default fallback image from Unsplash
        const defaultImage = 'https://images.unsplash.com/photo-1501854140801-50d01698950b';

        // Use the default image for all steps
        const img = new Image();
        img.src = defaultImage;
        await img.decode();
        setCurrentImageSrc(defaultImage);
        
        // Log for debugging
        console.log('Step:', step);
        console.log('Loading default image:', defaultImage);

      } catch (error) {
        console.error('Error loading image:', error);
        setImageError(true);
        // Set default image on error
        setCurrentImageSrc('https://images.unsplash.com/photo-1501854140801-50d01698950b');
      } finally {
        setIsLoading(false);
      }
    };

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
    // Set default image on error
    setCurrentImageSrc('https://images.unsplash.com/photo-1501854140801-50d01698950b');
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
