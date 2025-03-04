
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      <div className={`${isMobile ? 'text-3xl font-extrabold mb-1' : 'text-3xl font-bold'} text-[#30EE00]`}>
        Your Price: ${totalCost.toLocaleString()}
      </div>
      <div className={`${isMobile ? 'text-base' : 'text-xl mt-2'} text-[#FFFFFF]`}>
        Market Price: ${Math.round(totalCost * 1.4).toLocaleString()}
      </div>
    </div>
  );
}
