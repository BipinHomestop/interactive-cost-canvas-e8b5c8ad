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
        <h2 className="text-2xl font-bold text-[#0A0B3B] mb-2">Additional Sq Footage</h2>
        <p className="text-gray-600">
          Additional floor surface that is not used for parking. This includes storage areas, walkways, or any space exceeding 200 sq ft per car.
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <Button
          type="button"
          variant={needExtraFootage === "yes" ? "default" : "outline"}
          className={`flex-1 ${
            needExtraFootage === "yes" ? "bg-[#1A3174] text-white" : "bg-white text-[#0A0B3B]"
          }`}
          onClick={() => onNeedExtraFootageChange("yes")}
        >
          Yes
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-white text-[#0A0B3B]"
          onClick={() => onNeedExtraFootageChange("no")}
        >
          No
        </Button>
      </div>

      {needExtraFootage === "yes" && (
        <div className="grid grid-cols-2 gap-4">
          {["up-to-50", "51-100", "101-150", "151-200"].map((size) => (
            <Button
              key={size}
              type="button"
              variant={extraFootage === size ? "default" : "outline"}
              className={`${
                extraFootage === size ? "bg-[#1A3174] text-white" : "bg-white text-[#0A0B3B]"
              }`}
              onClick={() => onExtraFootageChange(size)}
            >
              {size === "up-to-50" ? "Up to 50 sqf" : 
               size === "51-100" ? "51-100 sqf" :
               size === "101-150" ? "101 - 150 sqf" : "151 - 200 sqf"}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}