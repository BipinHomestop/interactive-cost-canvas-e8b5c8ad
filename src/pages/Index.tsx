
import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, Phone, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { FAQSection } from "@/components/calculator/FAQSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MetaTags } from "@/seo/MetaTags";
import { SchemaScript } from "@/seo/SchemaScript";

const Index = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFAQs, setShowFAQs] = useState(false);
  const { stepNumber } = useParams<{ stepNumber: string }>();
  
  const currentStep = stepNumber ? parseInt(stepNumber, 10) : undefined;
  
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: stepNumber ? `/step/${stepNumber}` : '/',
        page_location: window.location.href
      });
    }
  }, [currentStep, stepNumber]);
  
  // Admin password check for analytics access
  const [showAdmin, setShowAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user has admin access in session storage
    const hasAdminAccess = sessionStorage.getItem('adminAccess') === 'true';
    setShowAdmin(hasAdminAccess);
    
    // Double-click event listener for admin access
    let clickCount = 0;
    let clickTimer: ReturnType<typeof setTimeout>;
    
    const handleLogoClick = () => {
      clickCount++;
      
      if (clickCount === 5) {
        const password = prompt("Enter admin password:");
        if (password === "ACC2024admin") { // Simple password for demo
          sessionStorage.setItem('adminAccess', 'true');
          setShowAdmin(true);
          alert("Admin access granted");
        }
        clickCount = 0;
      }
      
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 2000);
    };
    
    const logoElement = document.querySelector('nav img');
    if (logoElement) {
      logoElement.addEventListener('click', handleLogoClick);
    }
    
    return () => {
      if (logoElement) {
        logoElement.removeEventListener('click', handleLogoClick);
      }
      clearTimeout(clickTimer);
    };
  }, []);
  
  return (
    <div className="h-screen flex flex-col bg-card-DEFAULT overflow-hidden">
      <MetaTags step={currentStep} pathname={location.pathname} />
      <SchemaScript />
      <nav className="bg-white shadow-lg py-3 px-4 z-50 sticky top-0">
        <div className="flex justify-between items-center">
          <img 
            src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
            alt="American Concrete Coatings"
            className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
          />
          <div className="flex items-center gap-2">
            {showAdmin && (
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5"
                onClick={() => navigate('/analytics')}
              >
                <span className="text-xs">Analytics</span>
              </Button>
            )}
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
