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
        <h2 className="text-2xl font-bold text-[#0A0B3B] mb-2">Steps To The House</h2>
        <p className="text-gray-600">
          Concrete or brick steps only.
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant={needSteps === "yes" ? "default" : "outline"}
          className={`flex-1 ${
            needSteps === "yes" ? "bg-[#0A0B3B]" : ""
          }`}
          onClick={() => onNeedStepsChange("yes")}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant={needSteps === "no" ? "default" : "outline"}
          className={`flex-1 ${
            needSteps === "no" ? "bg-gray-200" : ""
          }`}
          onClick={() => onNeedStepsChange("no")}
        >
          No
        </Button>
      </div>
    </div>
  );
}