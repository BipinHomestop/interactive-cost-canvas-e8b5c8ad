
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`space-y-6 ${isMobile ? 'pb-8 px-2' : ''}`}>
      <div>
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Stem Walls</h2>
        <p className="text-gray-600">
          Stem walls are the vertical concrete surfaces around your garage.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className={`flex-1 border-2 ${
              needStemWalls === "yes"
                ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
            } ${isMobile ? 'h-14' : ''}`}
            onClick={() => onStemWallsChange("yes")}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant="outline"
            className={`flex-1 border-2 ${
              needStemWalls === "no"
                ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
            } ${isMobile ? 'h-14' : ''}`}
            onClick={() => onStemWallsChange("no")}
          >
            No
          </Button>
        </div>

        {needStemWalls === "yes" && (
          <div className="flex gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className={`flex-1 border-2 ${
                stemWallType === "standard"
                  ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                  : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
              } ${isMobile ? 'h-14' : ''}`}
              onClick={() => onStemWallTypeChange("standard")}
            >
              4" Standard
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`flex-1 border-2 ${
                stemWallType === "large"
                  ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                  : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
              } ${isMobile ? 'h-14' : ''}`}
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
