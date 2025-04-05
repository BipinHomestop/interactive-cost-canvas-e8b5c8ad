
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubmission } from "@/hooks/calculator/use-submission";
import { PriceBreakdown } from "./PriceBreakdown";
import { InstallationDatePicker } from "./InstallationDatePicker";
import { DiscountCodeInput } from "./DiscountCodeInput";
import { PaymentNavigation } from "./PaymentNavigation";
import { useDiscountCode } from "./useDiscountCode";
import { useCheckout } from "./useCheckout";
import { getBreakdownItems } from "./utils/breakdownUtils";
import { getPreservedCalculationData } from "@/hooks/calculator/utils/submission-db";

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
  
  // Check for preserved price on component mount
  useEffect(() => {
    const preservedPrice = getPreservedCalculationData();
    if (preservedPrice && preservedPrice > 0) {
      console.log('PaymentStep using preserved price:', preservedPrice);
      setFinalCost(preservedPrice);
    } else {
      console.log('PaymentStep using live totalCost:', totalCost);
      setFinalCost(totalCost);
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

  const { isLoading, handleCheckout } = useCheckout(
    formData,
    date,
    couponCode,
    discountPercentage,
    finalCost,
    discountedTotal,
    () => getBreakdownItems(formData, finalCost, discountPercentage)
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
