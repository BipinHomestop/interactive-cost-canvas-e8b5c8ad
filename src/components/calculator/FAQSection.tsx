
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  step: number;
}

export function FAQSection({ step }: FAQSectionProps) {
  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1:
        return "Location";
      case 2:
        return "Contact Information";
      case 3:
        return "Garage Capacity";
      case 4:
        return "Garage Finish";
      case 5:
        return "Stem Walls";
      case 6:
        return "House Steps";
      case 7:
        return "Additional Footage";
      case 8:
        return "Current Condition";
      case 9:
        return "Payment";
      default:
        return "General";
    }
  };

  const getFAQs = (step: number): FAQ[] => {
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
            question: "How will you use my contact information?",
            answer: "Your information is used solely to communicate about your project and will never be shared with third parties."
          },
          {
            question: "When will someone contact me?",
            answer: "Our team typically reaches out within 1 business day of receiving your information."
          },
          {
            question: "Can I specify preferred contact methods?",
            answer: "Yes, just let us know your preferred method of contact when filling out the form."
          },
          {
            question: "Is my information secure?",
            answer: "Yes, we use industry-standard encryption to protect your personal information."
          }
        ];
      case 3:
        return [
          {
            question: "How many cars can fit in different garage sizes?",
            answer: "A single car garage typically fits one car, a double garage fits two cars, and so on. Consider extra space for storage or workspace when choosing."
          },
          {
            question: "What's the recommended size for my needs?",
            answer: "Consider your vehicle sizes, storage needs, and available space. We can help you determine the best size during consultation."
          },
          {
            question: "Can I expand the garage later?",
            answer: "While possible, it's more cost-effective to build the right size initially. Plan for future needs when choosing your garage capacity."
          },
          {
            question: "Do you offer custom sizes?",
            answer: "Yes, we can customize garage sizes to meet your specific needs while adhering to local building codes."
          }
        ];
      case 4:
        return [
          {
            question: "Does the finish affect the price?",
            answer: "Yes, different finishes have varying costs. Premium finishes like granite or slate may affect the final price."
          },
          {
            question: "What's the most popular finish?",
            answer: "The Snowfall finish is our most popular choice, offering a clean and modern look that complements most home styles."
          },
          {
            question: "Will the finish fade or change color over time?",
            answer: "Our finishes are designed to be long-lasting and resistant to fading. They maintain their color and appearance for many years with proper maintenance."
          },
          {
            question: "How do I choose the best color for my garage?",
            answer: "Consider your home's exterior colors, architectural style, and personal preferences. We recommend selecting a finish that complements your home's existing color scheme."
          }
        ];
      case 5:
        return [
          {
            question: "What are stem walls?",
            answer: "Stem walls are vertical concrete surfaces that form the foundation of your garage, providing structural support and stability."
          },
          {
            question: "Do I need stem walls?",
            answer: "It depends on your garage design and local building requirements. Our team can assess your specific needs during consultation."
          },
          {
            question: "What's the difference between standard and large stem walls?",
            answer: "Standard stem walls are 4 inches thick, while large stem walls offer additional support for larger structures or specific soil conditions."
          },
          {
            question: "How long do stem walls last?",
            answer: "Properly constructed stem walls can last the lifetime of your garage with minimal maintenance."
          }
        ];
      case 6:
        return [
          {
            question: "Why might I need steps?",
            answer: "Steps are necessary when there's a height difference between your house and garage entrance for safe and convenient access."
          },
          {
            question: "What types of steps are available?",
            answer: "We offer various step designs that can be customized to match your home's style and meet safety requirements."
          },
          {
            question: "Are the steps covered by warranty?",
            answer: "Yes, our steps are covered under our comprehensive warranty package, ensuring long-lasting quality and safety."
          },
          {
            question: "Can steps be added later?",
            answer: "While possible, it's more cost-effective to include steps in the initial construction if you think you'll need them."
          }
        ];
      case 7:
        return [
          {
            question: "What is additional square footage?",
            answer: "Additional square footage refers to extra space added to your garage beyond the standard size for storage or workspace."
          },
          {
            question: "How much extra space should I add?",
            answer: "Consider your storage needs, workspace requirements, and future plans when deciding on additional square footage."
          },
          {
            question: "Does extra footage affect permits?",
            answer: "Yes, additional square footage may affect building permits and local zoning requirements. We'll handle all necessary paperwork."
          },
          {
            question: "Can I add space later?",
            answer: "While possible, it's more cost-effective to include the desired space in the initial construction."
          }
        ];
      case 8:
        return [
          {
            question: "What's the difference between original and existing conditions?",
            answer: "Original means no previous coating, while existing means there's an old coating that needs removal before application."
          },
          {
            question: "How is existing coating removed?",
            answer: "We use professional-grade equipment and techniques to safely remove existing coatings without damaging the surface."
          },
          {
            question: "Does removal affect the timeline?",
            answer: "Yes, removing existing coating adds some time to the project, but it's necessary for proper application."
          },
          {
            question: "Can you apply over existing coating?",
            answer: "For best results and longevity, we recommend removing existing coatings before applying new ones."
          }
        ];
      case 9:
        return [
          {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards and PayPal for secure and convenient payments."
          },
          {
            question: "Is the deposit refundable?",
            answer: "Yes, the deposit is fully refundable if you cancel within 48 hours of booking."
          },
          {
            question: "How is the final price calculated?",
            answer: "The final price includes all selected features, materials, and labor costs. Any additional costs are clearly broken down in your quote."
          },
          {
            question: "When will I be charged?",
            answer: "You'll only be charged the deposit amount today. The remaining balance is due upon completion of the project."
          }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-[#1A3174] text-left">
        {getStepTitle(step)} FAQ's
      </h2>
      <Accordion type="single" collapsible className="space-y-4">
        {getFAQs(step).map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index + 1}`} 
            className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="px-4 hover:no-underline text-left">
              <span className="text-[#1A3174] font-medium text-left">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-4 text-gray-600 text-left">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
