import React, { ReactNode } from 'react';
import { ImageDisplay } from './ImageDisplay';
import { FormNavigation } from './FormNavigation';
import { FAQSection } from './FAQSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { Toaster } from '../ui/toaster';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Phone, HelpCircle, X } from 'lucide-react';
import { useState } from 'react';
import { CalculatorInputs } from './types';
import { Link } from 'react-router-dom';

type CalcPageLayoutProps = {
  children: ReactNode;
  step: number;
  totalCost: number;
  options?: Partial<CalculatorInputs>;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled?: boolean;
  isLastStep?: boolean;
};

export function CalcPageLayout({
  children,
  step,
  totalCost,
  options,
  onNext,
  onPrev,
  isNextDisabled = false,
  isLastStep = false
}: CalcPageLayoutProps) {
  const isMobile = useIsMobile();
  const [showFAQs, setShowFAQs] = useState(false);
  const needsScrollOnMobile = () => {
    return [2, 4].includes(step);
  };

  console.log('CalcPageLayout rendering with options:', options);

  return (
    <div className="h-screen flex flex-col bg-card-DEFAULT overflow-hidden">
      <nav className="bg-white shadow-lg py-3 px-4 z-50 sticky top-0">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
              alt="American Concrete Coatings"
              className={`${isMobile ? 'h-8' : 'h-10'} w-auto`}
            />
          </Link>
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
        
        <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} items-stretch w-full h-full gap-0`}>
          <div className={`${isMobile ? 'w-full' : 'w-[40%]'} ${isMobile ? 'h-[35vh] min-h-[250px]' : 'h-full'}`}>
            <ImageDisplay totalCost={totalCost} step={step} options={options} />
          </div>
          
          <div className={`
            ${isMobile ? 'w-full' : 'w-[40%] border-x border-gray-200'} 
            bg-white p-4 sm:p-6
            ${isMobile ? 'flex-1 overflow-hidden' : 'h-full'} 
            relative
          `}>
            <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="h-full flex flex-col">
              {isMobile && needsScrollOnMobile() && step !== 9 ? (
                <ScrollArea className="flex-1 pr-2 overflow-y-auto">
                  {children}
                </ScrollArea>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {children}
                </div>
              )}
              {step < 9 && (
                <FormNavigation 
                  step={step} 
                  onNext={onNext} 
                  onPrev={onPrev} 
                  isLastStep={isLastStep} 
                  isNextDisabled={isNextDisabled} 
                />
              )}
            </form>
          </div>

          <div className={`
              ${isMobile ? 'w-full' : 'w-[20%]'} 
              bg-white p-6 
              ${isMobile ? 'h-auto' : 'h-full'} 
              ${isMobile && !showFAQs ? 'hidden' : ''}
            `}>
            {isMobile ? (
              <ScrollArea className="h-[calc(100vh-200px)]">
                {(step >= 3 || step <= 2 || step === 9) && <FAQSection step={step} />}
              </ScrollArea>
            ) : (
              (step >= 3 || step <= 2 || step === 9) && <FAQSection step={step} />
            )}
          </div>
        </div>
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
              <div className="pt-2">
                <FAQSection step={step} />
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
      <Toaster />
    </div>
  );
}
