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
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  
  useEffect(() => {
    const validateAndSetPrice = () => {
      const preservedPrice = getPreservedCalculationData();
      
      const breakdownTotal = usePriceBreakdown({
        formData,
        totalCost: totalCost,
        discountPercentage: 0
      }).breakdownItems.reduce((sum, item) => sum + item.price, 0);
      
      console.log('Price validation check:', {
        totalCost,
        preservedPrice,
        breakdownTotal
      });

      if (breakdownTotal > 0 && breakdownTotal !== totalCost) {
        console.log('Using breakdown total as it differs from provided total:', breakdownTotal);
        setFinalCost(breakdownTotal);
        preserveCalculationData(breakdownTotal);
        return;
      }
      
      if (totalCost > 0) {
        console.log('Using and preserving provided total:', totalCost);
        setFinalCost(totalCost);
        preserveCalculationData(totalCost);
        return;
      }
      
      if (preservedPrice && preservedPrice > 0) {
        console.log('Using preserved price:', preservedPrice);
        setFinalCost(preservedPrice);
        return;
      }

      if (formData?.garageCapacity) {
        const basePrice = formData.garageCapacity * 1600;
        console.log('Using calculated base price:', basePrice);
        setFinalCost(basePrice);
        preserveCalculationData(basePrice);
        
        toast({
          title: "Price Calculation",
          description: "Total has been recalculated based on your garage size.",
          duration: 6000,
        });
      }
    };
    
    validateAndSetPrice();
  }, [totalCost, formData, toast]);
  
  useEffect(() => {
    if (!submissionId) {
      const storedId = sessionStorage.getItem('calculatorSubmissionId');
      console.log('PaymentStep checking for stored submission ID:', storedId);
    } else {
      console.log('PaymentStep has submission ID from state:', submissionId);
    }
  }, [submissionId]);
  
  const { 
    couponCode, 
    setCouponCode, 
    discountPercentage, 
    discountedTotal, 
    handleApplyCoupon,
    setInitialDiscount
  } = useDiscountCode(finalCost);

  useEffect(() => {
    console.log('PaymentStepContainer price values:', {
      totalCost,
      finalCost,
      discountPercentage,
      discountedTotal
    });
  }, [totalCost, finalCost, discountPercentage, discountedTotal]);

  useEffect(() => {
    const cachedCouponCode = sessionStorage.getItem('cachedCouponCode');
    
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
