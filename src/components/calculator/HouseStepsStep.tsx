import { Button } from "@/components/ui/button";

interface HouseStepsStepProps {
  needSteps: string;
  onNeedStepsChange: (value: string) => void;
}

export function HouseStepsStep({
  needSteps,
  onNeedStepsChange,
}: HouseStepsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A0B3B] mb-2">House Steps</h2>
        <p className="text-gray-600">
          Do you need steps from your house to the garage?
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant={needSteps === "yes" ? "default" : "outline"}
          className={`flex-1 ${
            needSteps === "yes"
              ? "bg-[#1A3174] text-white"
              : "bg-white text-[#0A0B3B]"
          }`}
          onClick={() => onNeedStepsChange("yes")}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-white text-[#0A0B3B]"
          onClick={() => onNeedStepsChange("no")}
        >
          No
        </Button>
      </div>
    </div>
  );
}