
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useEffect, useState } from "react";

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(imageSrc);

  // Fallback image that we know exists
  const fallbackImage = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setImageError(false);
        
        // First try to load the provided image
        const img = new Image();
        img.src = imageSrc;
        
        // Add a timeout to avoid hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Image load timeout')), 5000);
        });

        // Race between image loading and timeout
        await Promise.race([
          img.decode(),
          timeoutPromise
        ]);

        setCurrentImageSrc(imageSrc);
        console.log('Successfully loaded image:', imageSrc);

      } catch (error) {
        console.error('Error loading primary image:', error);
        
        try {
          // Try to load fallback image
          const fallbackImg = new Image();
          fallbackImg.src = fallbackImage;
          await fallbackImg.decode();
          setCurrentImageSrc(fallbackImage);
          console.log('Using fallback image');
        } catch (fallbackError) {
          console.error('Even fallback image failed:', fallbackError);
          setImageError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [imageSrc, step]);

  const handleImageError = () => {
    console.error('Image failed to load:', currentImageSrc);
    setImageError(true);
    setCurrentImageSrc(fallbackImage);
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-gray-500 mt-2">Loading image...</p>
          </div>
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
          <div className="text-center p-4">
            <p className="text-gray-500 mb-2">Image failed to load.</p>
            <p className="text-sm text-gray-400">Using fallback image</p>
          </div>
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
