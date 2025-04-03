
import { Input } from "@/components/ui/input";
import { UseFormRegister, UseFormSetError, UseFormWatch } from "react-hook-form";
import { CalculatorInputs } from "./types";
import { useIsMobile } from "@/hooks/use-mobile";
import { FormControl, FormItem, FormLabel, FormMessage, Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { Flag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  // Phone validation function
  const validatePhoneNumber = (phone: string): boolean => {
    // Clean the input from any non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Check if it has exactly 10 digits for US phone numbers
    return cleanedPhone.length === 10;
  };
  
  // Watch phone value if watch is provided
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
  
  // Send contact information via email when all fields are filled
  useEffect(() => {
    const sendContactEmail = async () => {
      // Only send if all contact information is available and valid
      if (
        nameValue && 
        emailValue && 
        phoneValue && 
        validatePhoneNumber(phoneValue) &&
        !emailSent &&
        !isSending
      ) {
        try {
          setIsSending(true);
          console.log("Sending contact email with data:", {
            name: nameValue,
            email: emailValue,
            phone: phoneValue,
            location: locationValue
          });
          
          // Call our Edge Function to send the email
          const { data, error } = await supabase.functions.invoke('send-contact-email', {
            body: {
              name: nameValue,
              email: emailValue,
              phone: phoneValue,
              location: locationValue
            }
          });

          if (error) {
            console.error("Error sending contact email:", error);
            toast({
              title: "Error",
              description: "There was an issue sending your information. We'll still save your data.",
              variant: "destructive",
            });
            setIsSending(false);
          } else {
            console.log("Contact email sent successfully:", data);
            setEmailSent(true);
            setIsSending(false);
            toast({
              title: "Success",
              description: "Your contact information has been sent to our team.",
              className: "bg-green-500 text-white border-none",
            });
          }
        } catch (err) {
          console.error("Exception sending contact email:", err);
          toast({
            title: "Error",
            description: "There was an issue sending your information. We'll still save your data.",
            variant: "destructive",
          });
          setIsSending(false);
        }
      }
    };

    // Manual trigger of email sending when all fields are complete
    // This is more reliable than the debounce approach
    if (
      nameValue && 
      emailValue && 
      phoneValue && 
      validatePhoneNumber(phoneValue) &&
      !emailSent &&
      !isSending
    ) {
      sendContactEmail();
    }
  }, [nameValue, emailValue, phoneValue, locationValue, emailSent, isSending, toast]);
  
  // Manual send function for debugging
  const manualSend = async () => {
    if (emailSent || isSending) return;
    
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
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: nameValue,
          email: emailValue,
          phone: phoneValue,
          location: locationValue
        }
      });

      if (error) {
        console.error("Manual send error:", error);
        toast({
          title: "Error",
          description: `Failed to send email: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log("Manual send successful:", data);
        setEmailSent(true);
        toast({
          title: "Success",
          description: "Contact information sent successfully!",
          className: "bg-green-500 text-white border-none",
        });
      }
    } catch (err) {
      console.error("Manual send exception:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
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
      </div>
    </div>
  );
};
