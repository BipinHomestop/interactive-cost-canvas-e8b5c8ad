import { useIsMobile } from "@/hooks/use-mobile";
import { usePricingConfig } from "@/hooks/calculator/use-pricing-config";
import { useEffect, useState } from "react";
import { getPreservedCalculationData, preserveCalculationData } from "@/hooks/calculator/utils/submission-db";

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
    
    // Get preserved price (if any)
    const preservedPrice = getPreservedCalculationData();
    console.log('Checking for preserved price:', preservedPrice, 'current step:', currentStep);
    
    // If we're going back from the payment step OR we're on step 8 (last step before payment)
    // AND we have a preserved price, use it
    if ((currentStep === 8 || currentStep === 7 || currentStep === 6) && preservedPrice && preservedPrice > 0) {
      console.log('Using preserved price in overlay:', preservedPrice);
      setDisplayedCost(preservedPrice);
      return;
    }
    
    // Otherwise, ensure we update our displayed cost whenever the provided totalCost changes
    if (totalCost > 0) {
      console.log('Using calculated cost in overlay:', totalCost);
      setDisplayedCost(totalCost);
      
      // Also preserve the current totalCost for later use
      if (currentStep === 8) {
        preserveCalculationData(totalCost);
        console.log('Preserving current cost:', totalCost);
      }
    }
  }, [totalCost]);
  
  // Calculate market price (40% higher than our price by default)
  // Use the market_multiplier config if available
  const marketMultiplier = getPrice('market_multiplier', 1.4);
  const marketPrice = Math.round(displayedCost * marketMultiplier);
  
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
