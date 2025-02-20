import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
const Index = () => {
  return <div className="min-h-screen bg-card-DEFAULT">
      <nav className="bg-white shadow-sm py-4 px-6">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-[#1A3174]">
            GarageCalc
          </div>
          <Button variant="outline" className="border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5" onClick={() => window.location.href = "tel:+1234567890"}>
            <Phone className="w-4 h-4 mr-2" />
            Call Us
          </Button>
        </div>
      </nav>
      <div className="w-full">
        <CostCalculator />
      </div>
    </div>;
};
export default Index;