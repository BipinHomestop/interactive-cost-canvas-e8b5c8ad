import { Button } from "@/components/ui/button";
import { NavigationProps } from "./types";

export function FormNavigation({ step, onNext, onPrev, isLastStep }: NavigationProps) {
  return (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
      )}
      {step < 9 && (
        <Button
          type="button"
          className={`${step > 1 ? "" : "ml-auto"} bg-[#0EA5E9] hover:bg-[#0EA5E9]/90`}
          onClick={onNext}
        >
          {step === 8 ? "Finish" : "Next"}
        </Button>
      )}
    </div>
  );
}