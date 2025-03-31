
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Success() {
  const navigate = useNavigate();
  
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
      <Helmet>
        <title>Thank You | Form Submitted Successfully | American Concrete Coatings</title>
        <meta name="description" content="Thank you for submitting your information. An American Concrete Coatings representative will contact you shortly about your garage floor coating project." />
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/success" />
      </Helmet>
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
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-[#1A3174] hover:bg-[#132355] text-white"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
