
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { MetaTags } from '@/seo/MetaTags';
import { getSuccessPageMetaTags } from '@/seo/meta-utils';

export default function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Track successful submission
    console.log('Success page viewed');
    
    // Track conversion for analytics
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
        'transaction_id': sessionStorage.getItem('calculatorSubmissionId')
      });
    }
  }, []);
  
  return (
    <>
      <MetaTags customMeta={getSuccessPageMetaTags()} />
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-md">
          <div className="mb-6 flex flex-col items-center">
            <img 
              src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
              alt="American Concrete Coatings logo" 
              className="h-16 w-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-center text-[#1A3174]">Thank You!</h1>
            <p className="mt-2 text-center text-gray-600">
              Your information has been submitted successfully. One of our representatives will contact you shortly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#1A3174] hover:bg-[#132355] text-white"
            >
              Return Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = "tel:+18175882055"}
              className="border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call +1 (817) 588-2055
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
