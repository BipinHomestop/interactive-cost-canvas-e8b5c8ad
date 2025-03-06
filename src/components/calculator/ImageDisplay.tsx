
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ImageError } from "./components/ImageError";
import { PriceOverlay } from "./components/PriceOverlay";
import { useCalculatorImage } from "./hooks/useCalculatorImage";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const containerHeight = isMobile ? "h-[300px]" : "h-full";
  const imageContainerHeight = step <= 2 ? "h-full" : (isMobile ? "h-[75%]" : "h-[80%]");
  const priceContainerHeight = isMobile ? "h-[25%]" : "h-[20%]";

  return <div className={`relative ${containerHeight}`}>
      <div className={`relative ${imageContainerHeight}`}>
        {isLoading ? <LoadingSpinner /> : currentImageSrc && !imageError ? (
          <div className="w-full h-full">
            <img 
              key={currentImageSrc}
              src={currentImageSrc} 
              alt={`Step ${step} visualization`} 
              onError={() => {
                console.error('Image failed to load:', currentImageSrc);
                setImageError(true);
                toast({
                  title: "Image load failed",
                  description: "The image could not be displayed.",
                  variant: "destructive"
                });
              }} 
              className="w-full h-full object-cover" 
            />
          </div>
        ) : (
          <ImageError />
        )}
      </div>
      {step >= 3 && <div className={`${priceContainerHeight} relative`}><PriceOverlay totalCost={totalCost} /></div>}
    </div>;
}
