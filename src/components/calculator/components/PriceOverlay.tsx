import { useIsMobile } from "@/hooks/use-mobile";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { useEffect, useState } from "react";
import { getPreservedCalculationData } from "@/hooks/calculator/utils/submission-db";

interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  const [displayedCost, setDisplayedCost] = useState(totalCost);
  const isMobile = useIsMobile();
  const { getPrice } = usePricingConfig();
  
  // Log when price changes
  useEffect(() => {
    console.log('PriceOverlay rendering with totalCost:', totalCost);
    
    // Check if we're coming back from payment step
    const pathSegments = window.location.pathname.split('/');
    const currentStep = pathSegments.length > 1 && pathSegments[1] === 'step' ? 
                       parseInt(pathSegments[2]) : 1;
    
    // If we're on the last step before payment (step 8), check for preserved price
    if (currentStep === 8) {
      const preservedPrice = getPreservedCalculationData();
      if (preservedPrice && preservedPrice > 0) {
        console.log('Using preserved price in overlay:', preservedPrice);
        setDisplayedCost(preservedPrice);
        return;
      }
    }
    
    // Otherwise, ensure we update our displayed cost whenever the provided totalCost changes
    if (totalCost > 0) {
      setDisplayedCost(totalCost);
    }
  }, [totalCost]);
  
  // Calculate market price (40% higher than our price by default)
  // Use the market_multiplier config if available
  const marketMultiplier = getPrice('market_multiplier', 1.4);
  const marketPrice = Math.round(displayedCost * marketMultiplier);
  
  // Force using the live calculated value, not the cached one
  useEffect(() => {
    if (totalCost > 0) {
      // If we're not on the payment page, ensure we use the live calculated cost
      const pathSegments = window.location.pathname.split('/');
      const currentStep = pathSegments.length > 1 && pathSegments[1] === 'step' ? 
                         parseInt(pathSegments[2]) : 1;
      
      if (currentStep !== 9) {
        console.log('Using live calculated cost instead of cached value');
        // Only clear cached values if we're not coming from payment
        if (currentStep !== 8) {
          sessionStorage.removeItem('cachedTotalCost');
          sessionStorage.removeItem('cachedDiscountPercentage');
          sessionStorage.removeItem('cachedDiscountedTotal');
          sessionStorage.removeItem('cachedBreakdownItems');
        }
      }
    }
  }, [totalCost]);
  
  return (
    <div className={`absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center ${isMobile ? 'p-1' : 'p-4'}`}>
      <div className={`${isMobile ? 'text-2xl font-extrabold mb-1' : 'text-3xl font-bold'} text-[#30EE00]`}>
        Your Price: ${displayedCost.toLocaleString()}
      </div>
      <div className={`${isMobile ? 'text-sm' : 'text-xl mt-2'} text-[#FFFFFF]`}>
        Market Price: ${marketPrice.toLocaleString()}
      </div>
    </div>
  );
}
