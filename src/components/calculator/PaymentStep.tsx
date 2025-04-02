
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubmission } from "@/hooks/calculator/use-submission";
import { PriceBreakdown } from "./payment/PriceBreakdown";
import { InstallationDatePicker } from "./payment/InstallationDatePicker";
import { DiscountCodeInput } from "./payment/DiscountCodeInput";
import { PaymentNavigation } from "./payment/PaymentNavigation";
import { useDiscountCode } from "./payment/useDiscountCode";
import { useCheckout } from "./payment/useCheckout";

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep({ onBack, formData, totalCost }: PaymentStepProps) {
  const [date, setDate] = useState<Date>();
  const isMobile = useIsMobile();
  const { submissionId } = useSubmission();
  
  // Load submission ID from session storage if not available in state
  useEffect(() => {
    // This is just a backup - our hook should already be doing this
    if (!submissionId) {
      const storedId = sessionStorage.getItem('calculatorSubmissionId');
      console.log('PaymentStep checking for stored submission ID:', storedId);
    } else {
      console.log('PaymentStep has submission ID from state:', submissionId);
    }
  }, [submissionId]);
  
  // Check for cached values from a previous checkout attempt
  const [cachedTotal, setCachedTotal] = useState<number | null>(null);
  
  useEffect(() => {
    const cachedTotalStr = sessionStorage.getItem('cachedTotalCost');
    if (cachedTotalStr) {
      const parsedTotal = parseFloat(cachedTotalStr);
      if (!isNaN(parsedTotal)) {
        console.log('Found cached total cost:', parsedTotal);
        setCachedTotal(parsedTotal);
      }
    } else {
      // If no cached value exists, store the current total
      sessionStorage.setItem('cachedTotalCost', totalCost.toString());
    }
  }, [totalCost]);
  
  // Use cached total if available, otherwise use the passed-in total
  const effectiveTotalCost = cachedTotal !== null ? cachedTotal : totalCost;
  
  // Custom hooks for discount and checkout functionality
  const { 
    couponCode, 
    setCouponCode, 
    discountPercentage, 
    discountedTotal, 
    handleApplyCoupon,
    setInitialDiscount
  } = useDiscountCode(effectiveTotalCost);

  // Check for cached discount percentage
  useEffect(() => {
    const cachedDiscountPercentage = sessionStorage.getItem('cachedDiscountPercentage');
    const cachedCouponCode = sessionStorage.getItem('cachedCouponCode');
    
    if (cachedDiscountPercentage && cachedCouponCode) {
      const parsedPercentage = parseFloat(cachedDiscountPercentage);
      if (!isNaN(parsedPercentage) && parsedPercentage > 0) {
        console.log('Found cached discount:', parsedPercentage, 'for coupon:', cachedCouponCode);
        setInitialDiscount(parsedPercentage, cachedCouponCode);
      }
    }
  }, [setInitialDiscount]);

  // Get price breakdown items for checkout
  const getBreakdownItems = () => {
    // Check for cached breakdown items
    const cachedItems = sessionStorage.getItem('cachedBreakdownItems');
    if (cachedItems) {
      try {
        const parsedItems = JSON.parse(cachedItems);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          console.log('Using cached breakdown items');
          return parsedItems;
        }
      } catch (e) {
        console.error('Error parsing cached breakdown items:', e);
      }
    }
    
    // Generate the breakdown items if no cache exists
    const basePrice = formData.garageCapacity === 1 ? 1000 : 
                      formData.garageCapacity === 2 ? 2000 : 
                      formData.garageCapacity === 3 ? 3500 : 
                      formData.garageCapacity === 4 ? 4000 : 5000;
                      
    const finishMultiplier = formData.garageFinish === 'snowfall' ? 1.2 :
                            formData.garageFinish === 'carbon' ? 1.1 : 
                            formData.garageFinish === 'cabin_fever' ? 1.15 :
                            formData.garageFinish === 'creekbed' ? 1.2 :
                            formData.garageFinish === 'nightfall' ? 1.3 :
                            formData.garageFinish === 'orbit' ? 1.35 :
                            formData.garageFinish === 'outback' ? 1.4 :
                            formData.garageFinish === 'pecan' ? 1.45 :
                            formData.garageFinish === 'shoreline' ? 1.5 :
                            formData.garageFinish === 'tidal_wave' ? 1.55 :
                            formData.garageFinish === 'wombat' ? 1.6 :
                            formData.garageFinish === 'domino' ? 2 : 1.2;
                            
    const items = [
      {
        label: `${formData.garageCapacity}-Car Garage Base Price`,
        price: basePrice,
      },
      {
        label: `${formData.garageFinish.charAt(0).toUpperCase() + formData.garageFinish.slice(1)} Finish`,
        price: (basePrice * finishMultiplier) - basePrice,
      }
    ];
    
    // Add optional items
    if (formData.needStemWalls === 'yes' && formData.stemWallType) {
      const stemWallPrice = formData.stemWallType === 'standard' ? 500 : 1000;
      items.push({
        label: `${formData.stemWallType.charAt(0).toUpperCase() + formData.stemWallType.slice(1)} Stem Walls`,
        price: stemWallPrice,
      });
    }
    
    if (formData.needSteps === 'yes') {
      items.push({
        label: 'House Steps',
        price: 300,
      });
    }
    
    if (formData.needExtraFootage === 'yes' && formData.extraFootage) {
      const extraFootagePrice = 
        formData.extraFootage === 'up-to-50' ? 200 :
        formData.extraFootage === '51-100' ? 400 :
        formData.extraFootage === '101-150' ? 600 : 800;
      
      items.push({
        label: 'Additional Square Footage',
        price: extraFootagePrice,
      });
    }
    
    if (formData.currentCondition === 'existing') {
      items.push({
        label: 'Existing Condition Fee',
        price: 200,
      });
    }
    
    // Add discount if applicable
    if (discountPercentage > 0) {
      const discountAmount = (effectiveTotalCost * (discountPercentage / 100)) * -1;
      items.push({
        label: `Discount (${discountPercentage}%)`,
        price: discountAmount,
      });
    }
    
    return items;
  };

  const { isLoading, handleCheckout } = useCheckout(
    formData,
    date,
    couponCode,
    discountPercentage,
    effectiveTotalCost,
    discountedTotal,
    getBreakdownItems
  );

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-16' : 'h-[calc(100vh-80px)]'}`}>
      <div className={`${isMobile ? 'space-y-5' : 'space-y-6'} px-4 sm:px-6 pb-8`}>
        <PriceBreakdown 
          formData={formData} 
          totalCost={effectiveTotalCost} 
          discountPercentage={discountPercentage} 
          discountedTotal={discountedTotal} 
        />

        <InstallationDatePicker 
          date={date} 
          onDateSelect={setDate} 
        />

        <DiscountCodeInput 
          couponCode={couponCode} 
          setCouponCode={setCouponCode} 
          discountPercentage={discountPercentage} 
          onApplyCoupon={handleApplyCoupon} 
        />
      </div>

      <PaymentNavigation 
        onBack={onBack} 
        onCheckout={handleCheckout} 
        isLoading={isLoading} 
        isMobile={isMobile} 
      />
    </div>
  );
}
