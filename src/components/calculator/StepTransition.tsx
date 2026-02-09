import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StepTransitionProps {
  children: ReactNode;
  stepKey: number;
}

export function StepTransition({ children, stepKey }: StepTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(stepKey);

  useEffect(() => {
    if (stepKey !== currentKey) {
      // Fade out
      setIsVisible(false);
      
      // After fade out, update content and fade in
      const timeout = setTimeout(() => {
        setCurrentKey(stepKey);
        setIsVisible(true);
      }, 150);
      
      return () => clearTimeout(timeout);
    } else {
      // Initial mount
      setIsVisible(true);
    }
  }, [stepKey, currentKey]);

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-2"
      )}
    >
      {children}
    </div>
  );
}
