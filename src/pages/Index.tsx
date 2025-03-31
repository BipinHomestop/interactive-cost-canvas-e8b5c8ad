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
      1: "Enter Your Location | Garage Floor Coating Calculator",
      2: "Contact Information | Garage Floor Coating Calculator",
      3: "Select Garage Size | Garage Floor Coating Calculator",
      4: "Choose Finish Style | Garage Floor Coating Calculator",
      5: "Stem Wall Options | Garage Floor Coating Calculator",
      6: "House Steps Options | Garage Floor Coating Calculator",
      7: "Additional Square Footage | Garage Floor Coating Calculator",
      8: "Current Floor Condition | Garage Floor Coating Calculator",
      9: "Review & Payment | Garage Floor Coating Calculator"
    };
    return stepTitles[step as keyof typeof stepTitles] || "Garage Floor Coating Cost Calculator";
  }
  
  function getStepDescription(step: number): string {
    const stepDescriptions = {
      1: "Start by entering your ZIP code to check if we service your area for premium garage floor coatings.",
      2: "Provide your contact details to receive your customized garage floor coating estimate.",
      3: "Select the size of your garage to get an accurate cost calculation for your floor coating project.",
      4: "Choose from our premium garage floor coating finishes including Snowfall, Carbon, and Granite.",
      5: "Determine if your garage needs stem walls and select the appropriate type for your project.",
      6: "Add custom steps between your home and garage if needed for your floor coating project.",
      7: "Calculate additional square footage needs for your garage floor coating installation.",
      8: "Tell us about your current floor condition to get the most accurate price estimate.",
      9: "Review your selections and complete your garage floor coating order."
    };
    return stepDescriptions[step as keyof typeof stepDescriptions] || 
      "Calculate the cost of garage floor coatings in minutes! Use American Concrete Coatings estimator to get pricing on epoxy, polyurea, and polyaspartic coatings.";
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
              <span className={`${isMobile ? 'text-xs' : ''}`}>Call (817) 588-2055</span>
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
