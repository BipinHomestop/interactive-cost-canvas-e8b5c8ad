import { Button } from "@/components/ui/button";
import { NavigationProps } from "./types";

export function FormNavigation({ step, onNext, onPrev, isLastStep }: NavigationProps) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      {step > 1 ? (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrev}
          className="w-full border-2 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/10"
        >
          Back
        </Button>
      ) : (
        <div /> // Empty div for grid alignment when no back button
      )}
      {step < 9 && (
        <Button
          type="button"
          className="w-full bg-[#1A3174] hover:bg-[#1A3174]/90"
          onClick={onNext}
        >
          {isLastStep ? "Finish" : "Next"}
        </Button>
      )}
    </div>
  );
}