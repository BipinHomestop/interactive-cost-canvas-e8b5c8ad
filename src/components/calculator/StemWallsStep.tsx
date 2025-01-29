import { Button } from "@/components/ui/button";

interface StemWallsStepProps {
  needStemWalls: string;
  stemWallType?: string;
  onStemWallsChange: (value: string) => void;
  onStemWallTypeChange: (value: string) => void;
}

export function StemWallsStep({
  needStemWalls,
  stemWallType,
  onStemWallsChange,
  onStemWallTypeChange,
}: StemWallsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A0B3B] mb-2">Stem Walls</h2>
        <p className="text-gray-600">
          Stem walls are the vertical concrete surfaces around your garage.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            type="button"
            variant={needStemWalls === "yes" ? "default" : "outline"}
            className={`flex-1 ${
              needStemWalls === "yes"
                ? "bg-[#1A3174] text-white"
                : "bg-white text-[#0A0B3B]"
            }`}
            onClick={() => onStemWallsChange("yes")}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={needStemWalls === "no" ? "default" : "outline"}
            className={`flex-1 ${
              needStemWalls === "no"
                ? "bg-[#1A3174] text-white"
                : "bg-white text-[#0A0B3B]"
            }`}
            onClick={() => onStemWallsChange("no")}
          >
            No
          </Button>
        </div>

        {needStemWalls === "yes" && (
          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              variant={stemWallType === "standard" ? "default" : "outline"}
              className={`flex-1 ${
                stemWallType === "standard"
                  ? "bg-[#1A3174] text-white"
                  : "bg-white text-[#0A0B3B]"
              }`}
              onClick={() => onStemWallTypeChange("standard")}
            >
              4" Standard
            </Button>
            <Button
              type="button"
              variant={stemWallType === "large" ? "default" : "outline"}
              className={`flex-1 ${
                stemWallType === "large"
                  ? "bg-[#1A3174] text-white"
                  : "bg-white text-[#0A0B3B]"
              }`}
              onClick={() => onStemWallTypeChange("large")}
            >
              Large stem walls
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}