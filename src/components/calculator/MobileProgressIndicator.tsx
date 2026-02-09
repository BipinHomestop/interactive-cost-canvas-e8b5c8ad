import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function MobileProgressIndicator({ currentStep, totalSteps }: MobileProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full px-4 py-3 bg-white border-b border-gray-100">
      {/* Compact progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        <span className="text-xs font-medium text-primary whitespace-nowrap">
          {currentStep}/{totalSteps}
        </span>
      </div>
      
      {/* Step dots */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all duration-300",
              step < currentStep && "bg-primary text-white",
              step === currentStep && "bg-primary text-white ring-2 ring-primary/20 scale-110",
              step > currentStep && "bg-gray-200 text-gray-400"
            )}
          >
            {step < currentStep ? (
              <Check className="w-3 h-3" />
            ) : (
              step
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
