
import { PaymentStepContainer } from "./payment/PaymentStepContainer";
import { useEffect } from "react";
import { getPreservedCalculationData } from "@/hooks/calculator/utils/submission-db";
import { useToast } from "@/components/ui/use-toast";

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep(props: PaymentStepProps) {
  const { toast } = useToast();
  
  // Enhanced price validation check
  useEffect(() => {
    const preservedPrice = getPreservedCalculationData();
    const calculatedTotal = props.totalCost;
    
    // Log validation details
    console.log('PaymentStep price validation:', {
      providedPrice: calculatedTotal,
      preservedPrice,
      formDataComplete: props.formData && props.formData.garageCapacity
    });

    // Show warning if there's a significant price discrepancy
    if (preservedPrice && Math.abs(preservedPrice - calculatedTotal) > 100) {
      console.warn('Price discrepancy detected:', {
        calculated: calculatedTotal,
        preserved: preservedPrice
      });
      
      toast({
        title: "Price Verification",
        description: "Verifying your quote total. Please review the breakdown.",
        duration: 5000,
      });
    }
  }, [props.totalCost, props.formData, toast]);

  return <PaymentStepContainer {...props} />;
}
