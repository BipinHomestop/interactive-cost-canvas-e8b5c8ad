
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
  
  // Handle price preservation and restoration
  useEffect(() => {
    console.log('PriceOverlay rendering with totalCost:', totalCost);
    
    // Get the current step from URL path
    const pathSegments = window.location.pathname.split('/');
    const currentStep = pathSegments.length > 1 && pathSegments[1] === 'step' ? 
                       parseInt(pathSegments[2]) : 1;
    
    // Get preserved calculation data if available
    const preservedPrice = getPreservedCalculationData();
    console.log('Preserved price check:', preservedPrice, 'currentStep:', currentStep);
    
    // CASE 1: If we're on step 6, 7, 8 (pre-payment steps) and have preserved price, use it
    if ((currentStep === 6 || currentStep === 7 || currentStep === 8) && preservedPrice && preservedPrice > 0) {
      console.log('Using preserved price from session storage:', preservedPrice);
      setDisplayedCost(preservedPrice);
      return;
    }
    
    // CASE 2: If we have a valid totalCost from calculation, use and preserve it
    if (totalCost > 0) {
      console.log('Using and preserving new calculated cost:', totalCost);
      setDisplayedCost(totalCost);
      
      // Preserve the cost on step 8 (final step before payment)
      if (currentStep === 8) {
        preserveCalculationData(totalCost);
        console.log('Price preserved in session storage:', totalCost);
      }
    }
    
    // CASE 3: If we don't have a totalCost but do have preserved price, fall back to it
    else if (preservedPrice && preservedPrice > 0) {
      console.log('Falling back to preserved price:', preservedPrice);
      setDisplayedCost(preservedPrice);
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
