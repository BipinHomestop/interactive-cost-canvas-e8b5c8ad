
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "./components/LoadingSpinner";

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
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data, error } = await supabase
          .from('calculator_step_images')
          .select('image_type, image_path')
          .eq('step_number', 7);

        if (error) throw error;

        const imageMap = data.reduce((acc: Record<string, string>, img) => {
          const footageType = img.image_type;
          acc[footageType] = img.image_path;
          return acc;
        }, {});

        setImages(imageMap);
        setLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleNeedExtraFootageChange = (value: string) => {
    console.log('Step 7 - Need Extra Footage Change:', value);
    onNeedExtraFootageChange(value);
    if (value === 'no') {
      onExtraFootageChange('');
    }
  };

  const handleExtraFootageChange = (value: string) => {
    console.log('Step 7 - Extra Footage Type Change:', value);
    onExtraFootageChange(value);
  };

  return (
    <div className="space-y-6 h-[400px] overflow-y-auto">
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
            onClick={() => handleNeedExtraFootageChange("yes")}
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
            onClick={() => handleNeedExtraFootageChange("no")}
          >
            No
          </Button>
        </div>

        {needExtraFootage === "yes" && (
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {["up-to-50", "51-100", "101-150", "151-200"].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    className={`p-4 border-2 h-auto ${
                      extraFootage === value
                        ? "border-[#1A3174] bg-[#1A3174] text-white hover:bg-[#1A3174]/90"
                        : "border-gray-200 hover:border-[#1A3174]/50 bg-white text-[#0A0B3B] hover:bg-[#1A3174]/10"
                    }`}
                    onClick={() => handleExtraFootageChange(value)}
                  >
                    <span className="font-medium">
                      {value === "up-to-50" ? "Up to 50 sq ft" :
                       value === "51-100" ? "51-100 sq ft" :
                       value === "101-150" ? "101-150 sq ft" :
                       "151-200 sq ft"}
                    </span>
                  </Button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
