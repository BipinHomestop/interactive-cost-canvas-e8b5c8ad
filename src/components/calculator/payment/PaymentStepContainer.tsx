
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubmission } from "@/hooks/calculator/use-submission";
import { PriceBreakdown } from "./PriceBreakdown";
import { InstallationDatePicker } from "./InstallationDatePicker";
import { DiscountCodeInput } from "./DiscountCodeInput";
import { PaymentNavigation } from "./PaymentNavigation";
import { useDiscountCode } from "./useDiscountCode";
import { useCheckout } from "./useCheckout";
import { usePriceBreakdown } from "./hooks/usePriceBreakdown";
import { getPreservedCalculationData, preserveCalculationData } from "@/hooks/calculator/utils/submission-db";

interface PaymentStepContainerProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStepContainer({ 
  onBack, 
  formData, 
  totalCost 
}: PaymentStepContainerProps) {
  const [date, setDate] = useState<Date>();
  const [finalCost, setFinalCost] = useState<number>(totalCost);
  const isMobile = useIsMobile();
  const { submissionId } = useSubmission();
  
  // Initialize with the correct price, prioritizing preserved price
  useEffect(() => {
    const preservedPrice = getPreservedCalculationData();
    console.log('PaymentStep price initialization check:', { 
      preservedPrice, 
      totalCost, 
      finalCost 
    });
    
    if (preservedPrice && preservedPrice > 0) {
      console.log('PaymentStep using preserved price:', preservedPrice);
      setFinalCost(preservedPrice);
      
      // Re-preserve the price to ensure it persists
      preserveCalculationData(preservedPrice);
    } else if (totalCost > 0 && totalCost !== finalCost) {
      console.log('PaymentStep using and preserving live totalCost:', totalCost);
      setFinalCost(totalCost);
      preserveCalculationData(totalCost);
    }
  }, [totalCost]);
  
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
  
  // Custom hooks for discount and checkout functionality
  const { 
    couponCode, 
    setCouponCode, 
    discountPercentage, 
    discountedTotal, 
    handleApplyCoupon,
    setInitialDiscount
  } = useDiscountCode(finalCost);

  // Debug log to track price values
  useEffect(() => {
    console.log('PaymentStepContainer price values:', {
      totalCost,
      finalCost,
      discountPercentage,
      discountedTotal
    });
  }, [totalCost, finalCost, discountPercentage, discountedTotal]);

  // Check for cached discount percentage - only use if we're returning from a checkout attempt
  useEffect(() => {
    const cachedCouponCode = sessionStorage.getItem('cachedCouponCode');
    
    // Only restore discount if we have a coupon code cached
    if (cachedCouponCode && cachedCouponCode.length > 0) {
      const cachedDiscountPercentage = sessionStorage.getItem('cachedDiscountPercentage');
      
      if (cachedDiscountPercentage) {
        const parsedPercentage = parseFloat(cachedDiscountPercentage);
        if (!isNaN(parsedPercentage) && parsedPercentage > 0) {
          console.log('Found cached discount:', parsedPercentage, 'for coupon:', cachedCouponCode);
          setInitialDiscount(parsedPercentage, cachedCouponCode);
        }
      }
    }
  }, [setInitialDiscount]);

  // Use the price breakdown hook to get the breakdown items for checkout
  const { breakdownItems } = usePriceBreakdown({
    formData,
    totalCost: finalCost,
    discountPercentage
  });

  const { isLoading, handleCheckout } = useCheckout(
    formData,
    date,
    couponCode,
    discountPercentage,
    finalCost,
    discountedTotal,
    () => breakdownItems
  );

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-16' : 'h-[calc(100vh-80px)]'}`}>
      <div className={`${isMobile ? 'space-y-5' : 'space-y-6'} px-4 sm:px-6 pb-8`}>
        <PriceBreakdown 
          formData={formData} 
          totalCost={finalCost} 
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
