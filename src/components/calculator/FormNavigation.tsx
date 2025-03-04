
import { Button } from "@/components/ui/button";
import { NavigationProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";

export function FormNavigation({ step, onNext, onPrev, isLastStep, isNextDisabled }: NavigationProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`
      grid grid-cols-2 gap-4 w-full
      ${isMobile ? 'fixed bottom-0 left-0 right-0 bg-white shadow-md p-3 z-10' : ''}
    `}>
      {step > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev}
          className={`
            w-full border-2 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/10
            ${isMobile ? 'h-12' : ''}
          `}
        >
          Back
        </Button>
      ) : (
        <div />
      )}
      {step < 9 && (
        <Button
          type="button"
          className={`
            w-full bg-[#1A3174] hover:bg-[#1A3174]/90
            ${isMobile ? 'h-12' : ''}
          `}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {isLastStep ? "Finish" : "Next"}
        </Button>
      )}
    </div>
  );
}
