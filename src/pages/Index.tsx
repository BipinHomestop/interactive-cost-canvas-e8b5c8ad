import { CostCalculator } from "@/components/CostCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Cost Calculator
        </h1>
        <CostCalculator />
      </div>
    </div>
  );
};

export default Index;