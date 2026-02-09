import { Button } from "@/components/ui/button";
import { NavigationProps } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormNavigation({ step, onNext, onPrev, isLastStep, isNextDisabled }: NavigationProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "grid grid-cols-2 gap-4 w-full",
      isMobile && "py-3 mt-2 fixed bottom-0 left-0 right-0 px-4 bg-white z-50 border-t border-gray-100 shadow-sm"
    )}>
      {step > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev}
          className={cn(
            "w-full border-2 border-primary text-primary",
            "hover:bg-primary/10 hover:text-primary hover:border-primary",
            "transition-all duration-200 hover:shadow-md",
            "active:scale-[0.98] group",
            isMobile ? "h-12 rounded-full" : "rounded-lg"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          Back
        </Button>
      ) : (
        <div />
      )}
      {step < 9 && (
        <Button
          type="button"
          className={cn(
            "w-full bg-primary hover:bg-primary-light text-white",
            "transition-all duration-200 shadow-sm hover:shadow-lg",
            "active:scale-[0.98] group",
            isMobile ? "h-12 rounded-full" : "rounded-lg",
            isNextDisabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={onNext}
          disabled={isNextDisabled}
        >
          {isLastStep ? (
            <>
              Finish
              <Check className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:scale-110" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
