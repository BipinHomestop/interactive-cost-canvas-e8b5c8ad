
import { Button } from "@/components/ui/button";

interface CurrentConditionStepProps {
  condition: string;
  onConditionChange: (value: string) => void;
}

export function CurrentConditionStep({
  condition,
  onConditionChange,
}: CurrentConditionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Current Condition</h2>
        <p className="text-gray-600">
          The current condition of your concrete.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className={`${
            condition === "original"
              ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90"
              : "bg-white text-[#0A0B3B] hover:bg-[#1A3174]/10"
          }`}
          onClick={() => onConditionChange("original")}
        >
          Original Concrete
        </Button>
        <Button
          type="button"
          variant="outline"
          className={`${
            condition === "existing"
              ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90"
              : "bg-white text-[#0A0B3B] hover:bg-[#1A3174]/10"
          }`}
          onClick={() => onConditionChange("existing")}
        >
          I have an existing coating
        </Button>
      </div>
    </div>
  );
}
