
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";

const GARAGE_FINISHES = [
  { value: "snowfall", label: "Snowfall (Most Popular)" },
  { value: "granite", label: "Granite" },
  { value: "slate", label: "Slate" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
  { value: "glass", label: "Glass" },
  { value: "classic", label: "Classic" },
  { value: "premium", label: "Premium" },
  { value: "deluxe", label: "Deluxe" },
];

interface GarageFinishStepProps {
  selectedFinish: string;
  onFinishChange: (value: string) => void;
}

export function GarageFinishStep({ selectedFinish, onFinishChange }: GarageFinishStepProps) {
  return (
    <div className="h-[400px] overflow-y-auto">
      <h2 className="text-2xl font-bold text-[#1A3174] text-center mb-6">Garage Finish</h2>
      <div className="grid grid-cols-2 gap-4 pb-20">
        {GARAGE_FINISHES.map((finish) => (
          <Button
            key={finish.value}
            variant="outline"
            className={`p-4 border-2 h-auto ${
              selectedFinish === finish.value
                ? "border-[#1A3174] bg-[#1A3174] text-white hover:bg-[#1A3174]/90"
                : "border-gray-200 hover:border-[#1A3174]/50 bg-white text-[#0A0B3B] hover:bg-[#1A3174]/10"
            }`}
            onClick={() => onFinishChange(finish.value)}
          >
            <p className="font-medium">{finish.label}</p>
          </Button>
        ))}
      </div>
    </div>
  );
}
