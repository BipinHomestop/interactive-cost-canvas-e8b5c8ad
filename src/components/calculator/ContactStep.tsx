
import { Input } from "@/components/ui/input";
import { UseFormRegister, UseFormSetError, UseFormWatch } from "react-hook-form";
import { CalculatorInputs } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormControl, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Flag, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ContactStepProps {
  register: UseFormRegister<CalculatorInputs>;
  watch?: UseFormWatch<CalculatorInputs>;
  setError?: UseFormSetError<CalculatorInputs>;
}

export function ContactStep({
  register,
  watch,
  setError
}: ContactStepProps) {
  const isMobile = useIsMobile();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Phone validation function
  const validatePhoneNumber = (phone: string): boolean => {
    // Clean the input from any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if it has exactly 10 digits for US phone numbers
    return cleanedPhone.length === 10;
  };
  
  // Watch form values
  const phoneValue = watch ? watch("phone") : "";
  const nameValue = watch ? watch("name") : "";
  const emailValue = watch ? watch("email") : "";
  const locationValue = watch ? watch("location") : "";
  
  // Validate phone number on change
  useEffect(() => {
    if (phoneValue && phoneValue.length > 0) {
      const isValid = validatePhoneNumber(phoneValue);
      if (!isValid) {
        setPhoneError("Please enter a valid 10-digit phone number");
        if (setError) {
          setError("phone", { 
            type: "manual", 
            message: "Please enter a valid 10-digit phone number" 
          });
        }
      } else {
        setPhoneError(null);
      }
    } else {
      setPhoneError(null);
    }
  }, [phoneValue, setError]);
  
  // Manual send function 
  const sendContactEmail = async () => {
    // Reset states
    setErrorDetails(null);
    
    if (emailSent) {
      toast({
        title: "Email Already Sent",
        description: "Your information has already been sent to our team.",
        className: "bg-blue-500 text-white border-none",
      });
      return;
    }
    
    if (isSending) {
      toast({
        title: "Please Wait",
        description: "Your request is being processed...",
        className: "bg-blue-500 text-white border-none",
      });
      return;
    }
    
    if (!nameValue || !emailValue || !phoneValue) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePhoneNumber(phoneValue)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      console.log("Sending contact email with data:", {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        location: locationValue
      });
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: nameValue,
          email: emailValue,
          phone: phoneValue,
          location: locationValue
        }
      });

      console.log("Edge function response:", data, error);

      if (error) {
        console.error("Error sending contact email:", error);
        setErrorDetails(`Error: ${error.message}`);
        toast({
          title: "Error",
          description: "There was an issue sending your information. See details below.",
          variant: "destructive",
        });
        setIsSending(false);
      } else if (data && data.success) {
        console.log("Contact email sent successfully:", data);
        setEmailSent(true);
        setIsSending(false);
        toast({
          title: "Success",
          description: "Your contact information has been sent to our team.",
          className: "bg-green-500 text-white border-none",
        });
      } else {
        console.warn("Unexpected response:", data);
        setErrorDetails(`Unexpected response: ${JSON.stringify(data)}`);
        setIsSending(false);
        toast({
          title: "Warning",
          description: "Received an unexpected response. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Exception sending contact email:", err);
      setErrorDetails(`Exception: ${err instanceof Error ? err.message : String(err)}`);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      setIsSending(false);
    }
  };

  // Auto-submit when all fields are complete
  useEffect(() => {
    const allFieldsComplete = 
      nameValue && 
      emailValue && 
      phoneValue && 
      validatePhoneNumber(phoneValue);
      
    if (allFieldsComplete && !emailSent && !isSending) {
      // Auto-send after a short delay when all fields are complete
      const timer = setTimeout(() => {
        sendContactEmail();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [nameValue, emailValue, phoneValue, emailSent, isSending]);
  
  return (
    <div className={`space-y-4 ${isMobile ? 'px-1 pb-12' : 'px-4'}`}>
      <div>
        <h2 className="text-2xl font-bold text-[#1A3174] mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Please provide your contact details so we can send you the estimate.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <Input 
            id="name" 
            type="text" 
            className={`w-full focus-visible:ring-1 focus-visible:ring-[#1A3174] focus-visible:border-[#1A3174] ${isMobile ? 'h-12' : ''}`} 
            {...register("name")} 
            placeholder="Enter your full name" 
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <Flag className="h-4 w-4 text-gray-500" />
                <span className="text-gray-500 text-sm">+1</span>
              </div>
            </div>
            <Input 
              id="phone" 
              type="tel" 
              className={`w-full pl-16 focus-visible:ring-1 focus-visible:ring-[#1A3174] focus-visible:border-[#1A3174] ${phoneError ? 'border-red-500' : ''} ${isMobile ? 'h-12' : ''}`} 
              {...register("phone")} 
              placeholder="(555) 123-4567" 
            />
          </div>
          {phoneError && (
            <p className="mt-1 text-sm text-red-500">{phoneError}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <Input 
            id="email" 
            type="email" 
            className={`w-full focus-visible:ring-1 focus-visible:ring-[#1A3174] focus-visible:border-[#1A3174] ${isMobile ? 'h-12' : ''}`} 
            {...register("email")} 
            placeholder="Enter your email address" 
          />
        </div>

        <div className="mt-4">
          <Button 
            type="button"
            onClick={sendContactEmail}
            disabled={isSending || emailSent || !nameValue || !emailValue || !phoneValue || !validatePhoneNumber(phoneValue)}
            className="w-full bg-[#1A3174] hover:bg-[#132559] text-white"
          >
            {isSending ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : emailSent ? (
              "Information Sent ✓"
            ) : (
              "Send Contact Information"
            )}
          </Button>
        </div>

        {emailSent && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            ✓ Your contact information has been sent to our team.
          </div>
        )}
        
        {isSending && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
            Sending your information...
          </div>
        )}

        {errorDetails && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-start">
            <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Error Details:</p>
              <p className="text-xs mt-1 break-words">{errorDetails}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
