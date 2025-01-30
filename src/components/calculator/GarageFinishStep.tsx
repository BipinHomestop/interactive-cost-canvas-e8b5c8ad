const GARAGE_FINISHES = [
  { value: "snowfall", label: "Snowfall (Most Popular)", image: "/lovable-uploads/8c5fc18c-04f5-4038-8b7c-26b5ab584d2f.png" },
  { value: "granite", label: "Granite", image: "/lovable-uploads/1b676e13-3b36-4585-82b2-96f50b9c10c0.png" },
  { value: "slate", label: "Slate", image: "/lovable-uploads/ce778aca-463e-48c6-a97c-54df92faef72.png" },
  { value: "modern", label: "Modern", image: "/lovable-uploads/7d5dc9e5-0c4f-4b51-aa9a-0ff2b7d29bf9.png" },
  { value: "minimal", label: "Minimal", image: "/lovable-uploads/8b955fc5-c99f-4bff-87c9-f8a0b2e32bd2.png" },
  { value: "glass", label: "Glass", image: "/lovable-uploads/4c24b8ad-5c50-4280-8905-dd9a24dbbcbc.png" },
  { value: "classic", label: "Classic", image: "/lovable-uploads/92d12e0d-490e-43c8-955b-c49e5a453d04.png" },
  { value: "premium", label: "Premium", image: "/lovable-uploads/c18b700b-4c7b-4cac-83af-1a93338d0af3.png" },
  { value: "deluxe", label: "Deluxe", image: "/lovable-uploads/aae22676-da29-4df0-8e61-9ffe09a999b5.png" },
];

interface GarageFinishStepProps {
  selectedFinish: string;
  onFinishChange: (value: string) => void;
}

export function GarageFinishStep({ selectedFinish, onFinishChange }: GarageFinishStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Garage Finish</h2>
      <div className="grid grid-cols-2 gap-4">
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
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img src={finish.image} alt={finish.label} className="w-full h-full object-cover" />
              </div>
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