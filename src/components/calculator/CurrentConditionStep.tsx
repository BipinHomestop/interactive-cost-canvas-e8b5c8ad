
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "./components/LoadingSpinner";

interface CurrentConditionStepProps {
  condition: string;
  onConditionChange: (value: string) => void;
}

export function CurrentConditionStep({
  condition,
  onConditionChange,
}: CurrentConditionStepProps) {
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const { data, error } = await supabase
          .from('calculator_step_images')
          .select('image_type, image_path')
          .eq('step_number', 8);

        if (error) throw error;

        const imageMap = data.reduce((acc: Record<string, string>, img) => {
          acc[img.image_type] = img.image_path;
          return acc;
        }, {});

        setImages(imageMap);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Current Condition</h2>
        <p className="text-gray-600">
          The current condition of your concrete.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {["original", "existing"].map((value) => (
              <div
                key={value}
                className={`relative cursor-pointer group transition-all rounded-lg overflow-hidden border-2 ${
                  condition === value
                    ? "border-[#1A3174]"
                    : "border-transparent hover:border-[#1A3174]/50"
                }`}
                onClick={() => onConditionChange(value)}
              >
                <div className="aspect-video relative">
                  <img
                    src={images[value] || '/placeholder.svg'}
                    alt={`${value} condition`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center ${
                    condition === value
                      ? "bg-[#1A3174]/60"
                      : "bg-black/40 group-hover:bg-[#1A3174]/40"
                  }`}>
                    <span className="text-white font-medium">
                      {value === "original" ? "Original Concrete" : "Existing Coating"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
