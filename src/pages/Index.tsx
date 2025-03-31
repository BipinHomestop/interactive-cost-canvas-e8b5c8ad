import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, Phone, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { FAQSection } from "@/components/calculator/FAQSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";

const Index = () => {
  const isMobile = useIsMobile();
  const [showFAQs, setShowFAQs] = useState(false);
  const { stepNumber } = useParams<{ stepNumber: string }>();
  
  const currentStep = stepNumber ? parseInt(stepNumber, 10) : 1;
  const stepTitle = getStepTitle(currentStep);
  
  function getStepTitle(step: number): string {
    const stepTitles = {
      1: "Estimate Your Garage Concrete Coating Cost | American Concrete Coatings",
      2: "Contact Information | American Concrete Coatings",
      3: "Select Garage Size | American Concrete Coatings",
      4: "Choose Finish Style | American Concrete Coatings",
      5: "Stem Wall Options | American Concrete Coatings",
      6: "House Steps Options | American Concrete Coatings",
      7: "Additional Square Footage | American Concrete Coatings",
      8: "Current Floor Condition | American Concrete Coatings",
      9: "Review & Payment | American Concrete Coatings"
    };
    return stepTitles[step as keyof typeof stepTitles] || "Garage Floor Coating Cost Calculator | American Concrete Coatings";
  }
  
  function getStepDescription(step: number): string {
    const stepDescriptions = {
      1: "Calculate the cost of garage floor coatings in minutes! Use American Concrete Coatings estimator to get an instant quote on durable, long-lasting floor coatings at American Concrete Coatings.",
      2: "Provide your contact details to receive your customized garage floor coating estimate from American Concrete Coatings.",
      3: "Select the size of your garage to get an accurate cost calculation for your floor coating project from American Concrete Coatings.",
      4: "Choose from our premium garage floor coating finishes including Snowfall, Carbon, and Granite at American Concrete Coatings.",
      5: "Determine if your garage needs stem walls and select the appropriate type for your project with American Concrete Coatings.",
      6: "Add custom steps between your home and garage if needed for your floor coating project with American Concrete Coatings.",
      7: "Calculate additional square footage needs for your garage floor coating installation with American Concrete Coatings.",
      8: "Tell us about your current floor condition to get the most accurate price estimate from American Concrete Coatings.",
      9: "Review your selections and complete your garage floor coating order with American Concrete Coatings."
    };
    return stepDescriptions[step as keyof typeof stepDescriptions] || 
      "Calculate the cost of garage floor coatings in minutes! Use American Concrete Coatings estimator to get an instant quote on durable, long-lasting floor coatings at American Concrete Coatings.";
  }
  
  const getCanonicalUrl = (step: number): string => {
    const baseUrl = "https://quote.garagefloorcoatingsdfw.com";
    return step === 1 ? baseUrl : `${baseUrl}/step/${step}`;
  };
  
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: stepTitle,
        page_path: stepNumber ? `/step/${stepNumber}` : '/',
        page_location: window.location.href
      });
    }
    console.log(`Viewing step ${currentStep}: ${stepTitle}`);
  }, [currentStep, stepTitle, stepNumber]);
  
  return (
    <div className="h-screen flex flex-col bg-card-DEFAULT overflow-hidden">
      <Helmet>
        <title>{stepTitle}</title>
        <meta name="description" content={getStepDescription(currentStep)} />
        <link rel="canonical" href={getCanonicalUrl(currentStep)} />
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
              onClick={() => window.location.href = "tel:+18175882055"}
            >
              <Phone className="w-4 h-4 mr-1" />
              {!isMobile && <span>Call +1 (817) 588-2055</span>}
              {isMobile && <span className="text-xs">Call Us</span>}
            </Button>
          </div>
        </div>
      </nav>
      <div className="flex-1 overflow-hidden">
        <h1 className="text-2xl font-bold text-center text-[#1A3174] my-4 sr-only">Garage Floor Coating Cost Calculator</h1>
        <CostCalculator />
      </div>
      
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
