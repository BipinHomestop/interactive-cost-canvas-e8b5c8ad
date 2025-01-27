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
        <h2 className="text-2xl font-bold text-[#0A0B3B] mb-2">Current Condition</h2>
        <p className="text-gray-600">
          The current condition of your concrete.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={condition === "original" ? "default" : "outline"}
          className={`${
            condition === "original" ? "bg-[#0A0B3B]" : "bg-white"
          }`}
          onClick={() => onConditionChange("original")}
        >
          Original Concrete
        </Button>
        <Button
          type="button"
          variant={condition === "existing" ? "default" : "outline"}
          className={`${
            condition === "existing" ? "bg-[#0A0B3B]" : "bg-white"
          }`}
          onClick={() => onConditionChange("existing")}
        >
          I have an existing coating
        </Button>
      </div>
    </div>
  );
}