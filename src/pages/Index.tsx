
import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, Phone, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { FAQSection } from "@/components/calculator/FAQSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Helmet } from "react-helmet";

const Index = () => {
  const isMobile = useIsMobile();
  const [showFAQs, setShowFAQs] = useState(false);
  
  useEffect(() => {
    // Track page view for analytics
    console.log('Home page viewed');
  }, []);
  
  return (
    <div className="h-screen flex flex-col bg-card-DEFAULT overflow-hidden">
      <Helmet>
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/" />
        <meta name="description" content="Calculate the cost of garage floor coatings in minutes! Use American Concrete Coatings estimator to get pricing on epoxy, polyurea, and polyaspartic coatings." />
      </Helmet>
      <nav className="bg-white shadow-lg py-3 px-4 z-50 sticky top-0">
        <div className="flex justify-between items-center">
          <img 
            src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
            alt="American Concrete Coatings"
            className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
          />
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5"
                onClick={() => setShowFAQs(true)}
              >
                <HelpCircle className="w-4 h-4 mr-1" />
                <span className="text-xs">FAQs</span>
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              className={`${isMobile ? 'h-9' : 'h-12'} border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5`}
              onClick={() => window.location.href = "tel:+1234567890"}
            >
              <Phone className="w-4 h-4 mr-1" />
              <span className={`${isMobile ? 'text-xs' : ''}`}>Call Us</span>
            </Button>
          </div>
        </div>
      </nav>
      <div className="flex-1 overflow-hidden">
        <h1 className="text-2xl font-bold text-center text-[#1A3174] my-4 sr-only">Garage Floor Coating Cost Calculator</h1>
        <CostCalculator />
      </div>
      
      {/* Mobile FAQ Overlay */}
      {showFAQs && isMobile && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="bg-[#1A3174] text-white p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Frequently Asked Questions</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white hover:bg-[#1A3174]/80"
              onClick={() => setShowFAQs(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-8 pb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
                <div key={step} className="pt-2">
                  <FAQSection step={step} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default Index;
