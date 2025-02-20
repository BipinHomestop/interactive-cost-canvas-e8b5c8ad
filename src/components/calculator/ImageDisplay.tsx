import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ImageError } from "./components/ImageError";
import { PriceOverlay } from "./components/PriceOverlay";
import { useCalculatorImage } from "./hooks/useCalculatorImage";
export function ImageDisplay({
  totalCost,
  step,
  options
}: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const {
    toast
  } = useToast();
  const {
    isLoading,
    imageError,
    currentImageSrc,
    setImageError
  } = useCalculatorImage(step, options);
  const containerHeight = isMobile ? "h-[300px]" : "h-[600px]";
  console.log('ImageDisplay - Current options:', options);
  console.log('ImageDisplay - Current image source:', currentImageSrc);
  return <div className={`relative ${containerHeight}`}>
      {isLoading ? <LoadingSpinner /> : currentImageSrc && !imageError ? <div className="w-full h-full">
          <img key={currentImageSrc} // Add key to force re-render when source changes
      src={currentImageSrc} alt={`Step ${step} visualization`} onError={() => {
        console.error('Image failed to load:', currentImageSrc);
        setImageError(true);
        toast({
          title: "Image load failed",
          description: "The image could not be displayed.",
          variant: "destructive"
        });
      }} className="background:white" />
        </div> : <ImageError />}
      {step >= 3 && <PriceOverlay totalCost={totalCost} />}
    </div>;
}