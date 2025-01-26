import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
                ? "bg-[#0A0B3B] text-white"
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
                ? "bg-[#C4C1BB] text-white"
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
                  ? "bg-[#C4C1BB] text-white"
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
                  ? "bg-[#0A0B3B] text-white"
                  : "bg-white text-[#0A0B3B]"
              }`}
              onClick={() => onStemWallTypeChange("large")}
            >
              Large stem walls
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">FAQ's</h3>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-between">
            How tall are typical stem walls
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Why should I coat my stem walls?
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}