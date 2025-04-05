
import { PaymentStepContainer } from "./payment/PaymentStepContainer";

interface PaymentStepProps {
  onBack: () => void;
  formData: any;
  totalCost: number;
}

export function PaymentStep(props: PaymentStepProps) {
  return <PaymentStepContainer {...props} />;
}
