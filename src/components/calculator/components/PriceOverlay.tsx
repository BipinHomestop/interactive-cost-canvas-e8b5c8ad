import { useIsMobile } from "@/hooks/use-mobile";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { useEffect, useState } from "react";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { cn } from "@/lib/utils";

interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  const [targetCost, setTargetCost] = useState(totalCost);
  const [isUpdating, setIsUpdating] = useState(false);
  const isMobile = useIsMobile();
  const { getPrice } = usePricingConfig();
  
  // Animated counter hook
  const displayedCost = useAnimatedCounter(targetCost, { duration: 600 });
  
  useEffect(() => {
    console.log('PriceOverlay updating with totalCost:', totalCost);
    if (totalCost > 0 && totalCost !== targetCost) {
      setIsUpdating(true);
      setTargetCost(totalCost);
      
      // Remove glow effect after animation
      const timeout = setTimeout(() => setIsUpdating(false), 700);
      return () => clearTimeout(timeout);
    }
  }, [totalCost, targetCost]);
  
  // Calculate market price (40% higher than our price by default)
  const marketMultiplier = getPrice('market_multiplier', 1.4);
  const marketPrice = Math.round(displayedCost * marketMultiplier);
  
  return (
    <div className={cn(
      "absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center transition-all duration-300",
      isMobile ? 'p-1' : 'p-4'
    )}>
      <div className={cn(
        "transition-all duration-300",
        isMobile ? 'text-2xl font-extrabold mb-1' : 'text-3xl font-bold',
        "text-[#30EE00]",
        isUpdating && "scale-105 drop-shadow-[0_0_15px_rgba(48,238,0,0.5)]"
      )}>
        Your Price: ${displayedCost.toLocaleString()}
      </div>
      <div className={cn(
        isMobile ? 'text-sm' : 'text-xl mt-2',
        "text-white/90 transition-all duration-300"
      )}>
        Market Price: ${marketPrice.toLocaleString()}
      </div>
    </div>
  );
}
