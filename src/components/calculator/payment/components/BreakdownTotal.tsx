
interface BreakdownTotalProps {
  total: number;
  hasDiscrepancy: boolean;
}

export function BreakdownTotal({ total, hasDiscrepancy }: BreakdownTotalProps) {
  return (
    <>
      <div className="border-t pt-3 mt-3 flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      {hasDiscrepancy && (
        <div className="text-xs text-red-500 mt-1">
          Note: There may be a small rounding difference in the total.
        </div>
      )}
    </>
  );
}
