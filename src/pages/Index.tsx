
import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Index = () => {
  return <div className="h-screen flex flex-col bg-card-DEFAULT">
      <nav className="bg-white shadow-lg py-4 px-6 z-50">
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
      <div className="flex-1 overflow-hidden">
        <CostCalculator />
      </div>
    </div>;
};

export default Index;
