
import { AlertCircle } from "lucide-react";

export function ImageError() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
      <p className="text-gray-700 font-medium text-center">Image could not be loaded</p>
      <p className="text-gray-500 text-sm text-center mt-1">Please continue with the form</p>
    </div>
  );
}
