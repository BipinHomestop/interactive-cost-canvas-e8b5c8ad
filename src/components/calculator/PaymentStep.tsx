
import { PaymentStepContainer } from "./payment/PaymentStepContainer";
import { useEffect } from "react";
import { getPreservedCalculationData } from "@/hooks/calculator/utils/submission-db";

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep(props: PaymentStepProps) {
  // Check for potential pricing issues
  useEffect(() => {
    // Log price validation check
    console.log('PaymentStep price validation check:', {
      providedPrice: props.totalCost,
      preservedPrice: getPreservedCalculationData(),
      formDataComplete: props.formData && props.formData.garageCapacity
    });
  }, [props.totalCost, props.formData]);

  return <PaymentStepContainer {...props} />;
}
