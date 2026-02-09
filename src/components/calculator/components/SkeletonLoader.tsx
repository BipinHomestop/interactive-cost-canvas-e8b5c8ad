import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: "image" | "text" | "card";
}

export function SkeletonLoader({ className, variant = "image" }: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";
  
  if (variant === "image") {
    return (
      <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
        <div className={cn(baseClasses, "w-full h-full rounded-lg")} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }
  
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className={cn(baseClasses, "h-4 rounded w-3/4")} />
        <div className={cn(baseClasses, "h-4 rounded w-1/2")} />
      </div>
    );
  }
  
  return (
    <div className={cn(baseClasses, "rounded-lg", className)} />
  );
}
