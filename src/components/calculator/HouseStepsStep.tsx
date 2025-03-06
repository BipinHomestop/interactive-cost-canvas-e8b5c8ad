
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface HouseStepsStepProps {
  needSteps: string;
  onNeedStepsChange: (value: string) => void;
}

export function HouseStepsStep({
  needSteps,
  onNeedStepsChange,
}: HouseStepsStepProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-6 ${isMobile ? 'pb-8 px-2' : ''}`}>
      <div>
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">House Steps</h2>
        <p className="text-gray-600">
          Do you need steps from your house to the garage?
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className={`flex-1 border-2 transition-colors ${
            needSteps === "yes"
              ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
              : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
          } ${isMobile ? 'h-14' : ''}`}
          onClick={() => onNeedStepsChange("yes")}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant="outline"
          className={`flex-1 border-2 transition-colors ${
            needSteps === "no"
              ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
              : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
          } ${isMobile ? 'h-14' : ''}`}
          onClick={() => onNeedStepsChange("no")}
        >
          No
        </Button>
      </div>
    </div>
  );
}
