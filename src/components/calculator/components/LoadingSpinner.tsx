
export function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3174]"></div>
    </div>
  );
}
