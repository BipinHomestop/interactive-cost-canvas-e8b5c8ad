
import { PaymentStepContainer } from "./payment/PaymentStepContainer";
import { useEffect, useState } from "react";
import { getPreservedCalculationData } from "@/hooks/calculator/utils/submission-db";
import { useToast } from "@/components/ui/use-toast";

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep(props: PaymentStepProps) {
  const { toast } = useToast();
  const [validatedTotalCost, setValidatedTotalCost] = useState(props.totalCost);
  
  // Enhanced price validation check
  useEffect(() => {
    const preservedPrice = getPreservedCalculationData();
    const calculatedTotal = props.totalCost;
    
    // Always ensure we have a valid price
    let finalPrice = calculatedTotal;
    
    if (calculatedTotal <= 0 && preservedPrice && preservedPrice > 0) {
      finalPrice = preservedPrice;
      console.log('Using preserved price instead of invalid calculated price:', preservedPrice);
    } else if (calculatedTotal <= 0 && props.formData?.garageCapacity) {
      // Fallback to base calculation if both calculated and preserved prices are invalid
      finalPrice = props.formData.garageCapacity * 1600;
      console.log('Using fallback calculation for price:', finalPrice);
    }
    
    // Log validation details
    console.log('PaymentStep price validation:', {
      providedPrice: calculatedTotal,
      preservedPrice,
      finalPrice,
      formDataComplete: props.formData && props.formData.garageCapacity
    });

    // Update the state with the validated price
    setValidatedTotalCost(finalPrice);

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

  return <PaymentStepContainer 
    onBack={props.onBack} 
    formData={props.formData} 
    totalCost={validatedTotalCost} 
  />;
}
