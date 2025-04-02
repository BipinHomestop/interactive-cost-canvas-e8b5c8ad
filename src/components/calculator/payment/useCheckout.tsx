
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubmission } from "@/hooks/calculator/use-submission";
import { format } from "date-fns";

export function useCheckout(
  formData: any,
  date: Date | undefined,
  couponCode: string,
  discountPercentage: number,
  totalCost: number,
  discountedTotal: number,
  getBreakdownItems: () => Array<{label: string, price: number}>
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { submissionId, updatePaymentInfo } = useSubmission();

  const handleCheckout = async () => {
    if (!date) {
      toast({
        title: "Select installation date",
        description: "Please select your preferred installation date",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get the submission ID - either from state or session storage
      const currentSubmissionId = submissionId || sessionStorage.getItem('calculatorSubmissionId');
      
      if (!currentSubmissionId) {
        console.error('No submission ID found. User may need to start over from the beginning.');
        toast({
          title: "Session Error",
          description: "Your session information is missing. Please start over from the beginning.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log('Proceeding with checkout using submission ID:', currentSubmissionId);

      // First, update the submission with the installation date
      console.log('Calling updatePaymentInfo with date:', date);
      const updated = await updatePaymentInfo(date);
      
      if (!updated) {
        console.error('Failed to update submission with installation date');
        throw new Error("Failed to update submission with installation date");
      }

      console.log('Successfully updated installation date, proceeding to checkout');

      // Cache the breakdown items before sending to ensure consistency if user returns
      const breakdownItems = getBreakdownItems();
      sessionStorage.setItem('cachedBreakdownItems', JSON.stringify(breakdownItems));
      sessionStorage.setItem('cachedTotalCost', totalCost.toString());
      sessionStorage.setItem('cachedDiscountPercentage', discountPercentage.toString());
      sessionStorage.setItem('cachedDiscountedTotal', discountedTotal.toString());

      // Prepare line items for Stripe based on price breakdown
      const lineItems = breakdownItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.label,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: 1,
      }));

      // Metadata to include with the Stripe checkout session
      const metadata = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        installation_date: date ? format(date, "yyyy-MM-dd") : '',
        garage_capacity: formData.garageCapacity,
        garage_finish: formData.garageFinish,
        coupon_code: couponCode || 'none',
        discount_percentage: discountPercentage.toString(),
        submission_id: currentSubmissionId
      };

      console.log('Calling Stripe checkout with metadata:', metadata);

      // Create the checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          lineItems: lineItems,
          totalAmount: discountPercentage > 0 ? discountedTotal : totalCost,
          metadata: metadata,
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/step/9', // Return to payment step
        },
      });

      console.log('Stripe checkout response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Error creating checkout session');
      }

      if (data && data.url) {
        // Update submission with checkout session ID
        if (data.sessionId) {
          console.log('Updating with checkout session ID:', data.sessionId);
          await updatePaymentInfo(date, data.sessionId, 'checkout_started');
        }
        
        // Redirect to Stripe Checkout
        console.log('Redirecting to Stripe checkout URL:', data.url);
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        throw new Error('No checkout URL returned from payment processor');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCheckout };
}
