import { useIsMobile } from "@/hooks/use-mobile";
import { ImageDisplayProps } from "./types";

export function ImageDisplay({ imageSrc, totalCost, step }: ImageDisplayProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="relative">
      <img
        src={imageSrc}
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