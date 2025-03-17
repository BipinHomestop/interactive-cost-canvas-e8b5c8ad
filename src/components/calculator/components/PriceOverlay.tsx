
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { Card } from "@/components/ui/card";

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
    <div className={`absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}>
      {isMobile ? (
        // Mobile layout with smaller font sizes
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="text-xl font-extrabold text-[#30EE00]">
            Your Price: ${totalCost.toLocaleString()}
          </div>
          <div className="text-xs mt-1 text-[#FFFFFF]">
            Market Price: ${marketPrice.toLocaleString()}
          </div>
          <div className="text-xs mt-1 text-[#30EE00]">
            You save: ${savings.toLocaleString()} ({savingsPercentage}%)
          </div>
        </div>
      ) : (
        // Desktop layout - unchanged
        <div>
          <div className="text-3xl font-bold text-[#30EE00]">
            Your Price: ${totalCost.toLocaleString()}
          </div>
          <div className="text-xl mt-2 text-[#FFFFFF]">
            Market Price: ${marketPrice.toLocaleString()}
          </div>
          <div className="text-sm mt-2 text-[#30EE00]">
            You save: ${savings.toLocaleString()} ({savingsPercentage}%)
          </div>
        </div>
      )}
    </div>
  );
}
