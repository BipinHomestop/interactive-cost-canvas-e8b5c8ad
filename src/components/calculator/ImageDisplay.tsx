import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { SkeletonLoader } from "./components/SkeletonLoader";
import { ImageError } from "./components/ImageError";
import { PriceOverlay } from "./components/PriceOverlay";
import { useCalculatorImage } from "./hooks/useCalculatorImage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export function ImageDisplay({
  totalCost,
  step,
  options
}: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const {
    isLoading,
    imageError,
    currentImageSrc,
    setImageError
  } = useCalculatorImage(step, options);

  const containerHeight = isMobile ? "h-full" : "h-full";
  const imageContainerHeight = step <= 2 ? "h-full" : (isMobile ? "h-[80%]" : "h-[80%]");
  const priceContainerHeight = isMobile ? "h-[20%]" : "h-[20%]";

  const handleRetry = useCallback(() => {
    setImageError(false);
    setIsImageLoaded(false);
  }, [setImageError]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  return (
    <div className={cn("relative", containerHeight)}>
      <div className={cn("relative", imageContainerHeight)}>
        {isLoading ? (
          <SkeletonLoader variant="image" />
        ) : currentImageSrc && !imageError ? (
          <div className="w-full h-full relative overflow-hidden">
            {/* Blur placeholder */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
            )}
            <img 
              key={currentImageSrc}
              src={currentImageSrc} 
              alt={`Step ${step} visualization`} 
              onLoad={handleImageLoad}
              onError={() => {
                console.error('Image failed to load:', currentImageSrc);
                setImageError(true);
                toast({
                  title: "Image load failed",
                  description: "The image could not be displayed.",
                  variant: "destructive"
                });
              }} 
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                isImageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
            />
          </div>
        ) : (
          <ImageError onRetry={handleRetry} />
        )}
      </div>
      {step >= 3 && (
        <div className={cn(priceContainerHeight, "relative")}>
          <PriceOverlay totalCost={totalCost} />
        </div>
      )}
    </div>
  );
}
