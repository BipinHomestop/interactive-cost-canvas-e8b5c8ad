
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps, StepImages } from "./types";
import { useEffect, useState, useMemo } from "react";

const STEP_IMAGES: StepImages = {
  1: "/lovable-uploads/68de81cd-8ab3-48fb-a096-8672f01e69ae.png",
  2: "/lovable-uploads/5b5c0d70-9ee6-4985-b1a1-52cc2ce3c41d.png",
  3: "/lovable-uploads/efd78ab5-d4dc-4b0b-9124-b9047ba316af.png",
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
    no: "/lovable-uploads/2bb89b6f-c394-4d76-93ee-047d82eb9749.png",
    yes: {
      standard: "/lovable-uploads/9dea532c-a9e8-4644-a07d-7b8867b1f17d.png",
      large: "/lovable-uploads/e4f042a9-30ad-46b2-8fdd-0abb1945e9d1.png"
    }
  },
  6: {
    no: "/lovable-uploads/e41d431b-f2f4-45b2-8fe8-eda9ec59023f.png",
    yes: "/lovable-uploads/0555046f-fb66-410d-a93d-397b62a2a7ad.png"
  },
  8: {
    original: "/lovable-uploads/16e17eb8-95a0-4649-b904-c639da1bd7f6.png",
    existing: "/lovable-uploads/cd72dc3c-8cb1-49a2-bea5-048513a04853.png"
  }
};

// Global image cache
const imageCache = new Map<string, HTMLImageElement>();

// Improved preloadImage function with better error handling
const preloadImage = (url: string): Promise<HTMLImageElement> => {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
};

// Collect all image URLs from the STEP_IMAGES object
const getAllImageUrls = () => {
  const urls = new Set<string>();
  
  const processValue = (value: any) => {
    if (typeof value === 'string') {
      urls.add(value);
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(processValue);
    }
  };

  Object.values(STEP_IMAGES).forEach(processValue);
  return Array.from(urls);
};

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Memoized image source calculation
  const currentImageSrc = useMemo(() => {
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
  }, [step, options, imageSrc]);

  // Preload all images on mount
  useEffect(() => {
    const urls = getAllImageUrls();
    Promise.all(urls.map(url => preloadImage(url).catch(console.error)));
  }, []);

  // Handle image loading state changes
  useEffect(() => {
    if (!currentImageSrc) return;

    setIsLoading(true);
    setImageError(false);

    preloadImage(currentImageSrc)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setImageError(true);
      });
  }, [currentImageSrc]);

  return (
    <div className="relative">
      <img
        src={currentImageSrc}
        alt={`Step ${step} visualization`}
        className={`w-full rounded-lg shadow-lg object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        } ${isMobile ? "h-[300px]" : "h-[600px]"}`}
        onError={() => setImageError(true)}
      />
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <p className="text-gray-500">Image failed to load</p>
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

