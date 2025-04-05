
interface BreakdownItemProps {
  label: string;
  price: number;
}

export function BreakdownItem({ label, price }: BreakdownItemProps) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">${price.toFixed(2)}</span>
    </div>
  );
}
