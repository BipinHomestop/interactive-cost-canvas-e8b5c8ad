
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ImageError } from "./components/ImageError";
import { PriceOverlay } from "./components/PriceOverlay";
import { useCalculatorImage } from "./hooks/useCalculatorImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

export function ImageDisplay({
  totalCost,
  step,
  options
}: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const {
    isLoading,
    imageError,
    currentImageSrc,
    setImageError
  } = useCalculatorImage(step, options);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const containerHeight = isMobile ? "h-full" : "h-full";
  const imageContainerHeight = step <= 2 ? "h-full" : (isMobile ? "h-[80%]" : "h-[80%]");
  const priceContainerHeight = isMobile ? "h-[20%]" : "h-[20%]";

  // Reset the loaded state when image src changes
  useEffect(() => {
    setImageLoaded(false);
    setRetryCount(0);
  }, [currentImageSrc]);

  // Auto retry loading if image fails
  const handleImageError = () => {
    console.error('Image failed to load:', currentImageSrc);
    
    if (retryCount < maxRetries) {
      // Retry loading the image
      setRetryCount(prevCount => prevCount + 1);
      
      // Add a small delay before retry to avoid rapid failures
      setTimeout(() => {
        const img = new Image();
        img.src = currentImageSrc + '?retry=' + new Date().getTime();
        img.onload = () => {
          setImageLoaded(true);
          setImageError(false);
        };
        img.onerror = () => {
          if (retryCount + 1 >= maxRetries) {
            setImageError(true);
            toast({
              title: "Image load failed",
              description: "The image could not be displayed after multiple attempts.",
              variant: "destructive"
            });
          }
        };
      }, 1000);
    } else {
      setImageError(true);
      toast({
        title: "Image load failed",
        description: "The image could not be displayed.",
        variant: "destructive"
      });
    }
  };

  return <div className={`relative ${containerHeight}`}>
      <div className={`relative ${imageContainerHeight}`}>
        {isLoading || (currentImageSrc && !imageLoaded) ? <LoadingSpinner /> : null}
        
        {currentImageSrc && !imageError ? (
          <div className={`w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <img 
              key={`${currentImageSrc}-${retryCount}`}
              src={currentImageSrc + (retryCount > 0 ? `?retry=${retryCount}` : '')} 
              alt={`Step ${step} visualization`}
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : imageError ? (
          <ImageError />
        ) : null}
      </div>
      {step >= 3 && <div className={`${priceContainerHeight} relative`}><PriceOverlay totalCost={totalCost} /></div>}
    </div>;
}
