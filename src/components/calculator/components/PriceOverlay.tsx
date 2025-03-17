
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";

interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  const isMobile = useIsMobile();
  const { getPrice } = usePricingConfig();
  
  // Calculate market price (40% higher than our price by default)
  // Use the market_multiplier config if available
  const marketMultiplier = getPrice('market_multiplier', 1.4);
  const marketPrice = Math.round(totalCost * marketMultiplier);
  
  // Calculate savings
  const savings = marketPrice - totalCost;
  const savingsPercentage = Math.round((savings / marketPrice) * 100);
  
  return (
    <div className={`absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center ${isMobile ? 'p-1' : 'p-4'}`}>
      <div className={`${isMobile ? 'text-2xl font-extrabold mb-1' : 'text-3xl font-bold'} text-[#30EE00]`}>
        Your Price: ${totalCost.toLocaleString()}
      </div>
      <div className={`${isMobile ? 'text-sm' : 'text-xl mt-2'} text-[#FFFFFF]`}>
        Market Price: ${marketPrice.toLocaleString()}
      </div>
      <div className={`${isMobile ? 'text-xs mt-1' : 'text-sm mt-2'} text-[#30EE00]`}>
        You save: ${savings.toLocaleString()} ({savingsPercentage}%)
      </div>
    </div>
  );
}
