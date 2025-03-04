
import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { HelpCircle, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { FAQSection } from "@/components/calculator/FAQSection";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const isMobile = useIsMobile();
  const [showMobileFAQ, setShowMobileFAQ] = useState(false);

  return <div className="h-screen flex flex-col bg-card-DEFAULT">
      <nav className="bg-white shadow-lg py-4 px-6 z-50">
        <div className="flex justify-between items-center">
          <img 
            src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
            alt="American Concrete Coatings"
            className="h-10 w-auto"
          />
          <div className="flex gap-2">
            {isMobile && (
              <Button 
                variant="outline" 
                className="h-12 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5" 
                onClick={() => setShowMobileFAQ(!showMobileFAQ)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                FAQs
              </Button>
            )}
            <Button 
              variant="outline" 
              className="h-12 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5" 
              onClick={() => window.location.href = "tel:+1234567890"}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Us
            </Button>
          </div>
        </div>
      </nav>
      
      {isMobile && showMobileFAQ && (
        <div className="fixed inset-0 bg-white z-40 pt-24 px-4 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#1A3174]">FAQs</h2>
            <Button 
              variant="ghost" 
              className="h-10" 
              onClick={() => setShowMobileFAQ(false)}
            >
              Close
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-120px)]">
            <FAQSection step={1} />
          </ScrollArea>
        </div>
      )}
      
      <div className="flex-1 overflow-hidden">
        <CostCalculator />
      </div>
    </div>;
};

export default Index;
