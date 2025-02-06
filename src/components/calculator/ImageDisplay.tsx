
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useEffect, useState } from "react";

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
        
        const img = new Image();
        img.src = imageSrc;
        await img.decode();
        setCurrentImageSrc(imageSrc);
        
        console.log('Step:', step);
        console.log('Loading image:', imageSrc);

      } catch (error) {
        console.error('Error loading image:', error);
        setImageError(true);
        setCurrentImageSrc('/lovable-uploads/093c6d4b-f6c3-44e7-ab98-c4ce9efbf48d.png'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [step, options, imageSrc]);

  const handleImageError = () => {
    console.error('Image failed to load:', currentImageSrc);
    setImageError(true);
    setCurrentImageSrc('/lovable-uploads/093c6d4b-f6c3-44e7-ab98-c4ce9efbf48d.png'); // Default fallback
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
