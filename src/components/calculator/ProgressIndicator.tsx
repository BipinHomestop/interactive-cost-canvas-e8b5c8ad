import { Check } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[#1A3174]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-[#1A3174] transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {/* Step dots */}
      <div className="flex justify-between mt-3 px-1">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              transition-all duration-300
              ${step < currentStep 
                ? 'bg-[#1A3174] text-white shadow-sm' 
                : step === currentStep
                ? 'bg-[#1A3174] text-white ring-4 ring-[#1A3174]/20 shadow-md scale-110'
                : 'bg-gray-200 text-gray-400'
              }
            `}
          >
            {step < currentStep ? (
              <Check className="w-4 h-4" />
            ) : (
              step
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
