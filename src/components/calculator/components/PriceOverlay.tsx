
interface PriceOverlayProps {
  totalCost: number;
}

export function PriceOverlay({
  totalCost
}: PriceOverlayProps) {
  return <div className="absolute inset-0 bg-[#0A0B3B] text-white py-6 px-4">
      <div className="text-2xl font-bold">
        Your Price: ${totalCost.toLocaleString()}
      </div>
      <div className="text-[#FFA500]">
        Market Price: ${Math.round(totalCost * 1.4).toLocaleString()}
      </div>
    </div>;
}
