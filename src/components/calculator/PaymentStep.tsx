
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
  
  // Custom hooks for discount and checkout functionality
  const { 
    couponCode, 
    setCouponCode, 
    discountPercentage, 
    discountedTotal, 
    handleApplyCoupon 
  } = useDiscountCode(totalCost);

  // Get price breakdown items via the component
  const getPriceBreakdown = () => {
    // This is a bit of a hack to reuse the price breakdown logic
    // In a real-world scenario, we'd refactor this to extract the logic separately
    const priceBreakdownComponent = <PriceBreakdown 
      formData={formData} 
      totalCost={totalCost} 
      discountPercentage={discountPercentage} 
      discountedTotal={discountedTotal} 
    />;
    
    // Access the underlying component instance to get the breakdown items
    // @ts-ignore - we know this component has this method
    return priceBreakdownComponent.type.render(priceBreakdownComponent.props).props.breakdownItems;
  };

  const { isLoading, handleCheckout } = useCheckout(
    formData,
    date,
    couponCode,
    discountPercentage,
    totalCost,
    discountedTotal,
    getPriceBreakdown
  );

  return (
    <div className={`flex flex-col ${isMobile ? 'pb-16' : 'h-[calc(100vh-80px)]'}`}>
      <div className={`${isMobile ? 'space-y-5' : 'space-y-6'} px-4 sm:px-6 pb-8`}>
        <PriceBreakdown 
          formData={formData} 
          totalCost={totalCost} 
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
