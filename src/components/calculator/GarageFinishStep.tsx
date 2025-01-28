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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Garage Finish</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GARAGE_FINISHES.map((finish) => (
          <div
            key={finish.value}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedFinish === finish.value
                ? "border-primary bg-[#1A3174] text-white"
                : "border-gray-200 hover:border-primary/50 bg-white text-[#0A0B3B]"
            }`}
            onClick={() => onFinishChange(finish.value)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div>
                <p className="font-medium">{finish.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}