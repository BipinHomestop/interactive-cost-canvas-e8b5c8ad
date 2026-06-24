import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, CheckCircle2, Calendar, MessageSquare, Wrench, Home } from 'lucide-react';
import { MetaTags } from '@/seo/MetaTags';
import { getSuccessPageMetaTags } from '@/seo/meta-utils';
import { cn } from '@/lib/utils';

const timelineSteps = [
  { icon: MessageSquare, title: "Confirmation", description: "You'll receive an email confirmation shortly" },
  { icon: Calendar, title: "Scheduling", description: "Our team will call to schedule your installation" },
  { icon: Wrench, title: "Installation", description: "Professional installation by our certified team" },
];

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showContent, setShowContent] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  
  useEffect(() => {
    // Animate content entrance
    const contentTimer = setTimeout(() => setShowContent(true), 100);
    const timelineTimer = setTimeout(() => setShowTimeline(true), 500);
    
    // Track successful submission
    console.log('Success page viewed');
    
    // Track conversion for analytics
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
        'transaction_id': sessionStorage.getItem('calculatorSubmissionId')
      });
    }
    
    return () => {
      clearTimeout(contentTimer);
      clearTimeout(timelineTimer);
    };
  }, []);
  
  return (
    <>
      <MetaTags customMeta={getSuccessPageMetaTags()} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className={cn(
          "w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl transition-all duration-700",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className="mb-8 flex flex-col items-center">
            {/* Animated checkmark */}
            <div className={cn(
              "relative mb-6 transition-all duration-500 delay-200",
              showContent ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )}>
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <img 
              src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
              alt="American Concrete Coatings" 
              className="h-12 w-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-center text-primary">Quote Request Received</h1>
            <p className="mt-2 text-center text-gray-600">
              Your information has been submitted successfully. One of our representatives will contact you shortly.
            </p>
          </div>
          
          {/* Timeline section */}
          <div className={cn(
            "mb-8 transition-all duration-500",
            showTimeline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 text-center">
              What's Next
            </h2>
            <div className="space-y-4">
              {timelineSteps.map((step, index) => (
                <div 
                  key={step.title}
                  className={cn(
                    "flex items-start gap-4 transition-all duration-500",
                    showTimeline ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                  )}
                  style={{ transitionDelay: `${index * 150 + 600}ms` }}
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={() => navigate('/')}
              className={cn(
                "bg-primary hover:bg-primary-dark text-white",
                "transition-all duration-200 active:scale-[0.98] group"
              )}
            >
              <Home className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-0.5" />
              Return Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "tel:+18175882055"}
              className={cn(
                "border-primary text-primary hover:bg-primary/5",
                "transition-all duration-200 active:scale-[0.98] group"
              )}
            >
              <Phone className="w-4 h-4 mr-2 transition-transform group-hover:rotate-12" />
              Call +1 (817) 588-2055
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
