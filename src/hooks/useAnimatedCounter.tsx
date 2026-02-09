import { useState, useEffect, useRef } from "react";

interface UseAnimatedCounterOptions {
  duration?: number;
  easing?: (t: number) => number;
}

// Easing function for smooth animation
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

export function useAnimatedCounter(
  targetValue: number,
  options: UseAnimatedCounterOptions = {}
) {
  const { duration = 500, easing = easeOutQuart } = options;
  const [displayValue, setDisplayValue] = useState(targetValue);
  const previousValue = useRef(targetValue);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (targetValue === previousValue.current) return;
    
    const startValue = previousValue.current;
    const startTime = performance.now();
    const difference = targetValue - startValue;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      
      const currentValue = Math.round(startValue + difference * easedProgress);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        previousValue.current = targetValue;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration, easing]);

  return displayValue;
}
