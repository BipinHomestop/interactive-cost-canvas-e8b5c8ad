
export function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3174]"></div>
      <p className="text-gray-500 mt-2 text-sm">Loading image...</p>
    </div>
  );
}
