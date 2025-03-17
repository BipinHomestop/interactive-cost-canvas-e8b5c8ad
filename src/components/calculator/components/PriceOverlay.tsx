
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  const isMobile = useIsMobile();
  
  // Calculate market price (40% higher than our price)
  const marketPrice = Math.round(totalCost * 1.4);
  
  return (
    <div className={`absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center ${isMobile ? 'p-1' : 'p-4'}`}>
      <div className={`${isMobile ? 'text-2xl font-extrabold mb-1' : 'text-3xl font-bold'} text-[#30EE00]`}>
        Your Price: ${totalCost.toLocaleString()}
      </div>
      <div className={`${isMobile ? 'text-sm' : 'text-xl mt-2'} text-[#FFFFFF]`}>
        Market Price: ${marketPrice.toLocaleString()}
      </div>
    </div>
  );
}
