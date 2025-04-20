
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSubmission } from "@/hooks/calculator/use-submission";
import { PriceBreakdown } from "./PriceBreakdown";
import { InstallationDatePicker } from "./InstallationDatePicker";
import { DiscountCodeInput } from "./DiscountCodeInput";
import { PaymentNavigation } from "./PaymentNavigation";
import { useDiscountCode } from "./useDiscountCode";
import { useCheckout } from "./useCheckout";
import { getPreservedCalculationData, preserveCalculationData } from "@/hooks/calculator/utils/submission-db";
import { useToast } from "@/components/ui/use-toast";
import { BreakdownItem } from "@/components/calculator/types";

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
  const [finalCost, setFinalCost] = useState<number>(totalCost > 0 ? totalCost : 0);
  const [breakdownItems, setBreakdownItems] = useState<BreakdownItem[]>([]);
  const isMobile = useIsMobile();
  const { submissionId } = useSubmission();
  const { toast } = useToast();
  
  useEffect(() => {
    const validateAndSetPrice = () => {
      const preservedPrice = getPreservedCalculationData();
      
      // Only use provided totalCost if it's valid
      if (totalCost > 0) {
        console.log('Using and preserving provided total:', totalCost);
        setFinalCost(totalCost);
        preserveCalculationData(totalCost);
        return;
      }
      
      // Fall back to preserved price if available
      if (preservedPrice && preservedPrice > 0) {
        console.log('Using preserved price:', preservedPrice);
        setFinalCost(preservedPrice);
        return;
      }

      // Final fallback: calculate based on garage capacity
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

  // Handle the breakdown items update from the PriceBreakdown component
  const handleBreakdownItemsUpdate = (items: BreakdownItem[]) => {
    console.log('Received breakdown items update:', items);
    setBreakdownItems(items);
    
    // Cache the items for checkout
    sessionStorage.setItem('cachedBreakdownItems', JSON.stringify(items));
  };

  // This function is used by the checkout hook to get the current breakdown items
  const getBreakdownItemsForCheckout = () => {
    console.log('Getting breakdown items for checkout:', breakdownItems);
    
    // If we don't have items in state, try to get from session storage
    if (!breakdownItems || breakdownItems.length === 0) {
      try {
        const cachedItems = sessionStorage.getItem('cachedBreakdownItems');
        if (cachedItems) {
          return JSON.parse(cachedItems);
        }
      } catch (error) {
        console.error('Error getting cached breakdown items:', error);
      }
    }
    
    return breakdownItems;
  };

  const { isLoading, handleCheckout } = useCheckout(
    formData,
    date,
    couponCode,
    discountPercentage,
    finalCost,
    discountedTotal,
    getBreakdownItemsForCheckout
  );

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-16' : 'h-[calc(100vh-80px)]'}`}>
      <div className={`${isMobile ? 'space-y-5' : 'space-y-6'} px-4 sm:px-6 pb-8`}>
        <PriceBreakdown 
          formData={formData} 
          totalCost={finalCost} 
          discountPercentage={discountPercentage} 
          discountedTotal={discountedTotal} 
          step={9} // Always pass 9 since we're in the payment step
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
