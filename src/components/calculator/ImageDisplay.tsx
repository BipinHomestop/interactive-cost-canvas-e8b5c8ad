
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps, StepImages } from "./types";

const STEP_IMAGES: StepImages = {
  4: {
    snowfall: "/lovable-uploads/8c5fc18c-04f5-4038-8b7c-26b5ab584d2f.png",
    granite: "/lovable-uploads/1b676e13-3b36-4585-82b2-96f50b9c10c0.png",
    slate: "/lovable-uploads/ce778aca-463e-48c6-a97c-54df92faef72.png",
    modern: "/lovable-uploads/7d5dc9e5-0c4f-4b51-aa9a-0ff2b7d29bf9.png",
    minimal: "/lovable-uploads/8b955fc5-c99f-4bff-87c9-f8a0b2e32bd2.png",
    glass: "/lovable-uploads/4c24b8ad-5c50-4280-8905-dd9a24dbbcbc.png",
    classic: "/lovable-uploads/92d12e0d-490e-43c8-955b-c49e5a453d04.png",
    premium: "/lovable-uploads/c18b700b-4c7b-4cac-83af-1a93338d0af3.png",
    deluxe: "/lovable-uploads/aae22676-da29-4df0-8e61-9ffe09a999b5.png"
  },
  5: {
    no: "/lovable-uploads/4f83d853-09d7-4c01-a413-8afc3510d7aa.png",
    yes: {
      standard: "/lovable-uploads/2bb89b6f-c394-4d76-93ee-047d82eb9749.png",
      large: "/lovable-uploads/227500dc-42d6-4f5f-a573-d2aa8a8b5d11.png"
    }
  },
  6: {
    no: "/lovable-uploads/72033eb4-1949-420d-b7fe-c85dfeb3655c.png",
    yes: "/lovable-uploads/df962712-ee4f-4d54-931c-000bf94d6296.png"
  }
};

export function ImageDisplay({ imageSrc, totalCost, step, options }: ImageDisplayProps) {
  const isMobile = useIsMobile();

  const getImageSource = (): string => {
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
    
    return imageSrc;
  };
  
  return (
    <div className="relative">
      <img
        src={getImageSource()}
        alt={`Step ${step} visualization`}
        className={`w-full rounded-lg shadow-lg object-cover ${
          isMobile ? "h-[300px]" : "h-[600px]"
        }`}
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

