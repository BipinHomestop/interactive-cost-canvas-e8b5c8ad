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
      {!isLastStep && (
        <Button
          type="button"
          className="ml-auto"
          onClick={onNext}
        >
          Next
        </Button>
      )}
    </div>
  );
}