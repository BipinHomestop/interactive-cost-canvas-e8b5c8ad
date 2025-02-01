import { CostCalculator } from "@/components/CostCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Garage Cost Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get an instant estimate for your garage project. Follow the steps below to calculate your custom quote.
          </p>
        </div>
        <CostCalculator />
      </div>
    </div>
  );
};

export default Index;