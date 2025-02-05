
import { Button } from "@/components/ui/button";

interface AdditionalFootageStepProps {
  needExtraFootage: string;
  extraFootage?: string;
  onNeedExtraFootageChange: (value: string) => void;
  onExtraFootageChange: (value: string) => void;
}

export function AdditionalFootageStep({
  needExtraFootage,
  extraFootage,
  onNeedExtraFootageChange,
  onExtraFootageChange,
}: AdditionalFootageStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Additional Square Footage</h2>
        <p className="text-gray-600">
          Do you need additional square footage?
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            className={`flex-1 border-2 ${
              needExtraFootage === "yes"
                ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
            }`}
            onClick={() => onNeedExtraFootageChange("yes")}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant="outline"
            className={`flex-1 border-2 ${
              needExtraFootage === "no"
                ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
            }`}
            onClick={() => onNeedExtraFootageChange("no")}
          >
            No
          </Button>
        </div>

        {needExtraFootage === "yes" && (
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              className={`border-2 ${
                extraFootage === "up-to-50"
                  ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                  : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
              }`}
              onClick={() => onExtraFootageChange("up-to-50")}
            >
              Up to 50 sq ft
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`border-2 ${
                extraFootage === "51-100"
                  ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                  : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
              }`}
              onClick={() => onExtraFootageChange("51-100")}
            >
              51-100 sq ft
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`border-2 ${
                extraFootage === "101-150"
                  ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                  : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
              }`}
              onClick={() => onExtraFootageChange("101-150")}
            >
              101-150 sq ft
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`border-2 ${
                extraFootage === "151-200"
                  ? "bg-[#1A3174] text-white hover:bg-[#1A3174]/90 border-[#1A3174]"
                  : "bg-white text-[#1A3174] border-[#1A3174] hover:bg-[#1A3174]/10"
              }`}
              onClick={() => onExtraFootageChange("151-200")}
            >
              151-200 sq ft
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
