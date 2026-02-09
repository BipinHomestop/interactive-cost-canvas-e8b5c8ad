import { ImageOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageErrorProps {
  onRetry?: () => void;
}

export function ImageError({ onRetry }: ImageErrorProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
      <div className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-300/50 flex items-center justify-center">
          <ImageOff className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">Image not available</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className={cn(
              "mt-2 border-primary text-primary",
              "hover:bg-primary/10 transition-all duration-200",
              "active:scale-95 group"
            )}
          >
            <RefreshCw className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:rotate-180" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
