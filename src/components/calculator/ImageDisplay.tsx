
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps, StepImages } from "./types";
import { useEffect, useState } from "react";

const STEP_IMAGES: StepImages = {
  1: "/lovable-uploads/68de81cd-8ab3-48fb-a096-8672f01e69ae.png",
  2: "/lovable-uploads/5b5c0d70-9ee6-4985-b1a1-52cc2ce3c41d.png",
  3: "/lovable-uploads/bfe88b5d-f19b-4615-8aee-3dffae515600.png",
  4: {
    snowfall: "/lovable-uploads/8c5fc18c-04f5-4038-8b7c-26b5ab584d2f.png",
    granite: "/lovable-uploads/1b676e13-3b36-4585-82b2-96f50b9c10c0.png",
    slate: "/lovable-uploads/ce778aca-463e-48c6-a97c-54df92faef72.png",
    modern: "/lovable-uploads/7d5dc9e5-0c4f-4b51-aa9a-0ff2b7d29bf9.png",
    minimal: "/lovable-uploads/8b955fc5-c99f-4bff-87c9-f8a0b2e32bd2.png",
    glass: "/lovable-uploads/4c24b8ad-5c50-4280-8905-dd9a24dbbcbc.png",
    classic: "/lovable-uploads/92d12e0d-490e-43c8-955b-c49e5a453d04.png",
    premium: "/lovable-uploads/c18b700b-4c7b-4cac-83af-1a93338d0af3.png",
    deluxe: "/lovable-uploads/bfe88b5d-f19b-4615-8aee-3dffae515600.png"
  },
  5: {
    no: "/lovable-uploads/9dea532c-a9e8-4644-a07d-7b8867b1f17d.png",
    yes: {
      standard: "/lovable-uploads/2bb89b6f-c394-4d76-93ee-047d82eb9749.png",
      large: "/lovable-uploads/227500dc-42d6-4f5f-a573-d2aa8a8b5d11.png"
    }
  },
  6: {
    no: "/lovable-uploads/72033eb4-1949-420d-b7fe-c85dfeb3655c.png",
    yes: "/lovable-uploads/6b2f30e0-392c-4f2c-aa64-35b30071a687.png"
  },
  8: {
    original: "/lovable-uploads/cf6b538a-e34d-4762-9965-adcf1ec139a5.png",
    existing: "/lovable-uploads/3840b81a-a546-4328-8f6e-5461f8d4a263.png"
  }
};

// Preload images function
const preloadImages = () => {
  const allImages = new Set<string>();
  
  // Get all image URLs from STEP_IMAGES
  Object.values(STEP_IMAGES).forEach((value) => {
    if (typeof value === 'string') {
      allImages.add(value);
    } else if (typeof value === 'object') {
      Object.values(value).forEach((nestedValue) => {
        if (typeof nestedValue === 'string') {
          allImages.add(nestedValue);
        } else if (typeof nestedValue === 'object') {
          Object.values(nestedValue).forEach((deepValue) => {
            if (typeof deepValue === 'string') {
              allImages.add(deepValue);
            }
          });
        }
      });
    }
  });

  // Preload each image
  allImages.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string>(imageSrc);

  useEffect(() => {
    // Preload all images when component mounts
    preloadImages();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const newImage = getImageSource();
    const img = new Image();
    img.src = newImage;
    img.onload = () => {
      setCurrentImage(newImage);
      setIsLoading(false);
    };
  }, [step, options]);

  const getImageSource = (): string => {
    if (step <= 3) {
      return STEP_IMAGES[step] as string || imageSrc;
    }
    
    if (step === 4 && options?.garageFinish) {
      const images = STEP_IMAGES[4] as Record<string, string>;
      return images[options.garageFinish];
    }
    
    if (step === 5) {
      const stepImages = STEP_IMAGES[5] as Record<string, string | Record<string, string>>;
      if (options?.needStemWalls === 'yes' && options?.stemWallType) {
        const yesImages = stepImages.yes as Record<string, string>;
        return yesImages[options.stemWallType];
      }
      if (options?.needStemWalls === 'no') {
        return stepImages.no as string;
      }
    }
    
    if (step === 6 && options?.needSteps) {
      const stepImages = STEP_IMAGES[6] as Record<string, string>;
      return stepImages[options.needSteps];
    }

    if (step === 8 && options?.currentCondition) {
      const stepImages = STEP_IMAGES[8] as Record<string, string>;
      return stepImages[options.currentCondition];
    }
    
    return imageSrc;
  };
  
  return (
    <div className="relative">
      <img
        src={currentImage}
        alt={`Step ${step} visualization`}
        className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } ${isMobile ? "h-[300px]" : "h-[600px]"}`}
      />
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

