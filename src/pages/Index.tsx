import { CostCalculator } from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { AlertCircle, HelpCircle, Phone, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { FAQSection } from "@/components/calculator/FAQSection";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const isMobile = useIsMobile();
  const [showFAQs, setShowFAQs] = useState(false);

  const compileFaqData = () => {
    const faqData = [];
    for (let step = 1; step <= 9; step++) {
      const faqs = getFAQs(step);
      faqs.forEach(faq => {
        faqData.push({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        });
      });
    }
    return faqData;
  };

  useEffect(() => {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "American Concrete Coatings",
      "image": "https://quote.garagefloorcoatingsdfw.com/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Dallas-Fort Worth",
        "addressRegion": "TX",
        "addressCountry": "US"
      },
      "url": "https://quote.garagefloorcoatingsdfw.com/",
      "telephone": "+1234567890",
      "priceRange": "$$$",
      "description": "Professional garage floor coating services in the Dallas-Fort Worth area. We offer epoxy, polyurea, and polyaspartic coating solutions."
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": compileFaqData()
    };

    const addJsonLdScript = (schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    addJsonLdScript(localBusinessSchema);
    addJsonLdScript(faqSchema);

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  const getFAQs = (step: number) => {
    switch (step) {
      case 1:
        return [
          {
            question: "What locations do you serve?",
            answer: "We currently serve major cities across Texas, including Houston, Dallas, Austin, and San Antonio."
          },
          {
            question: "Do you offer services outside Texas?",
            answer: "Currently, we are focused on providing our services within Texas to ensure the highest quality of service."
          },
          {
            question: "How long does installation typically take?",
            answer: "Installation time varies based on the project scope, but typically takes 2-5 business days."
          },
          {
            question: "Do you offer free consultations?",
            answer: "Yes, we offer free initial consultations to discuss your project needs and provide accurate estimates."
          }
        ];
      case 2:
        return [
          {
            question: "What types of garage floor coatings do you offer?",
            answer: "We offer epoxy, polyurea, and polyaspartic coating solutions."
          },
          {
            question: "What is the warranty on your services?",
            answer: "Our services come with a 1-year warranty."
          },
          {
            question: "Do you offer financing options?",
            answer: "Yes, we offer financing options for our services."
          }
        ];
      case 3:
        return [
          {
            question: "What is the process for installing a garage floor coating?",
            answer: "The process typically involves cleaning the surface, applying the coating, and allowing it to cure."
          },
          {
            question: "What is the cost of a garage floor coating?",
            answer: "The cost of a garage floor coating can vary depending on the size and complexity of the project."
          },
          {
            question: "Do you offer any discounts for bulk orders?",
            answer: "Yes, we offer discounts for bulk orders."
          }
        ];
      case 4:
        return [
          {
            question: "What is the average time it takes to install a garage floor coating?",
            answer: "The average time it takes to install a garage floor coating is 2-5 business days."
          },
          {
            question: "What is the average cost of a garage floor coating?",
            answer: "The average cost of a garage floor coating is $500-$1,000."
          },
          {
            question: "Do you offer any promotions or discounts?",
            answer: "Yes, we offer promotions and discounts for our services."
          }
        ];
      case 5:
        return [
          {
            question: "What is the process for removing a garage floor coating?",
            answer: "The process typically involves cleaning the surface and removing the old coating."
          },
          {
            question: "What is the cost of removing a garage floor coating?",
            answer: "The cost of removing a garage floor coating can vary depending on the size and complexity of the project."
          },
          {
            question: "Do you offer any discounts for removing a garage floor coating?",
            answer: "Yes, we offer discounts for removing a garage floor coating."
          }
        ];
      case 6:
        return [
          {
            question: "What is the average time it takes to remove a garage floor coating?",
            answer: "The average time it takes to remove a garage floor coating is 2-5 business days."
          },
          {
            question: "What is the average cost of removing a garage floor coating?",
            answer: "The average cost of removing a garage floor coating is $500-$1,000."
          },
          {
            question: "Do you offer any promotions or discounts?",
            answer: "Yes, we offer promotions and discounts for our services."
          }
        ];
      case 7:
        return [
          {
            question: "What is the process for repairing a garage floor coating?",
            answer: "The process typically involves cleaning the surface and repairing any damage."
          },
          {
            question: "What is the cost of repairing a garage floor coating?",
            answer: "The cost of repairing a garage floor coating can vary depending on the size and complexity of the project."
          },
          {
            question: "Do you offer any discounts for repairing a garage floor coating?",
            answer: "Yes, we offer discounts for repairing a garage floor coating."
          }
        ];
      case 8:
        return [
          {
            question: "What is the average time it takes to repair a garage floor coating?",
            answer: "The average time it takes to repair a garage floor coating is 2-5 business days."
          },
          {
            question: "What is the average cost of repairing a garage floor coating?",
            answer: "The average cost of repairing a garage floor coating is $500-$1,000."
          },
          {
            question: "Do you offer any promotions or discounts?",
            answer: "Yes, we offer promotions and discounts for our services."
          }
        ];
      case 9:
        return [
          {
            question: "What is the process for maintaining a garage floor coating?",
            answer: "The process typically involves cleaning the surface and applying a protective coating."
          },
          {
            question: "What is the cost of maintaining a garage floor coating?",
            answer: "The cost of maintaining a garage floor coating can vary depending on the size and complexity of the project."
          },
          {
            question: "Do you offer any discounts for maintaining a garage floor coating?",
            answer: "Yes, we offer discounts for maintaining a garage floor coating."
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="h-screen flex flex-col bg-card-DEFAULT overflow-hidden">
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
        <h1 className={`text-2xl font-bold text-center text-[#1A3174] my-4 ${isMobile ? 'hidden' : ''}`}>
          Garage Floor Coating Cost Calculator
        </h1>
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
