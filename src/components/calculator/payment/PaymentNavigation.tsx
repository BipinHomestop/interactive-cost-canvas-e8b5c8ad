
import { Button } from "@/components/ui/button";

interface PaymentNavigationProps {
  onBack: () => void;
  onCheckout: () => void;
  isLoading: boolean;
  isMobile: boolean;
}

export function PaymentNavigation({ 
  onBack, 
  onCheckout, 
  isLoading, 
  isMobile 
}: PaymentNavigationProps) {
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-50 border-t">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex-1 h-12 rounded-full bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5 text-sm"
            disabled={isLoading}
          >
            Back
          </Button>
          <Button 
            className="flex-1 h-12 rounded-full bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm"
            onClick={onCheckout}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Complete"}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white p-4 sm:p-6 border-t mt-auto">
      <div className="flex gap-3 sm:gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1 h-12 sm:h-14 rounded-lg bg-white border border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5 text-sm sm:text-base"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button 
          className="flex-1 h-12 sm:h-14 rounded-lg bg-[#1A3174] text-white hover:bg-[#1A3174]/90 text-sm sm:text-base"
          onClick={onCheckout}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Complete your order"}
        </Button>
      </div>
    </div>
  );
}
