
import { CostCalculator } from "@/components/CostCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="text-center py-8 hidden sm:block">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1A3174] mb-4">
            Garage Cost Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto px-4">
            Get an instant estimate for your garage project. Follow the steps below to calculate your custom quote.
          </p>
        </div>
        <CostCalculator />
      </div>
    </div>
  );
};

export default Index;
