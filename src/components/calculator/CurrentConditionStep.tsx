
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

        console.log('Step 8 - Available images:', imageMap);
        setImages(imageMap);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const handleConditionChange = async (value: string) => {
    console.log('Step 8 - Condition changed to:', value);
    
    try {
      const { error } = await supabase
        .from('calculator_step_images')
        .update({ is_last_selected: true })
        .eq('step_number', 8)
        .eq('image_type', value);

      if (error) {
        console.error('Error updating last selected status:', error);
        throw error;
      }

      console.log('Step 8 - Successfully updated last selected status for:', value);
      onConditionChange(value);
    } catch (error) {
      console.error('Error in handleConditionChange:', error);
    }
  };

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
          ["original", "existing"].map((value) => (
            <Button
              key={value}
              variant="outline"
              className={`p-4 border-2 h-auto ${
                condition === value
                  ? "border-[#1A3174] bg-[#1A3174] text-white hover:bg-[#1A3174]/90"
                  : "border-gray-200 hover:border-[#1A3174]/50 bg-white text-[#0A0B3B] hover:bg-[#1A3174]/10"
              }`}
              onClick={() => handleConditionChange(value)}
            >
              <span className="font-medium">
                {value === "original" ? "Original Concrete" : "Existing Coating"}
              </span>
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
