interface PriceOverlayProps {
  totalCost: number;
}
export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  return <div className="absolute inset-0 bg-[#0A0B3B] text-white flex flex-col items-center justify-center">
      <div className="text-3xl font-bold text-[#30EE00]">
        Your Price: ${totalCost.toLocaleString()}
      </div>
      <div className="text-xl text-[#FFFFFF] mt-2">
        Market Price: ${Math.round(totalCost * 1.4).toLocaleString()}
      </div>
    </div>;
}