
import { useIsMobile } from "@/hooks/use-mobile";

interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center p-3">
      <div className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold text-[#30EE00]`}>
        Your Price: ${totalCost.toLocaleString()}
      </div>
      <div className={`${isMobile ? 'text-base' : 'text-xl'} text-[#FFFFFF] mt-1 sm:mt-2`}>
        Market Price: ${Math.round(totalCost * 1.4).toLocaleString()}
      </div>
    </div>
  );
}
