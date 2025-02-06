
const GARAGE_FINISHES = [
  { value: "snowfall", label: "Snowfall (Most Popular)", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "granite", label: "Granite", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "slate", label: "Slate", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "modern", label: "Modern", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "minimal", label: "Minimal", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "glass", label: "Glass", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "classic", label: "Classic", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "premium", label: "Premium", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
  { value: "deluxe", label: "Deluxe", image: "https://images.unsplash.com/photo-1501854140801-50d01698950b" },
];

interface GarageFinishStepProps {
  selectedFinish: string;
  onFinishChange: (value: string) => void;
}

export function GarageFinishStep({ selectedFinish, onFinishChange }: GarageFinishStepProps) {
  return (
    <div className="h-[500px] flex flex-col">
      <h2 className="text-2xl font-bold text-[#1A3174] text-center mb-6">Garage Finish</h2>
      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-4 pb-20">
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
                  <img src={finish.image} alt={finish.label} className="w-full h-full object-cover" loading="eager" />
                </div>
                <div>
                  <p className="font-medium">{finish.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
