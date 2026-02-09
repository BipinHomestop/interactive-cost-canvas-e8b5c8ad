
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSubmission } from "@/hooks/calculator/use-submission";
import { format } from "date-fns";
import { getPreservedCalculationData, getSessionTokenForCheckout } from "@/hooks/calculator/utils/submission-db";

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

      // Check if we should use preserved price
      const preservedPrice = getPreservedCalculationData();
      let finalTotalCost = preservedPrice && preservedPrice > 0 ? preservedPrice : totalCost;
      
      // Final sanity check to make sure we never process a zero price
      if (finalTotalCost <= 0) {
        console.error('Checkout attempted with zero or negative price');
        toast({
          title: "Price Error",
          description: "There was a problem with the price calculation. Please refresh and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const finalDiscountedTotal = discountPercentage > 0 ? 
                              Math.round(finalTotalCost * (1 - discountPercentage / 100)) : 
                              finalTotalCost;

      // Get the breakdown items directly from function
      let breakdownItems = getBreakdownItems();
      
      // If still no items, create a fallback item
      if (!breakdownItems || breakdownItems.length === 0) {
        console.log('No breakdown items available, using fallback');
        breakdownItems = [{
          label: `${formData.garageCapacity || 1}-Car Garage Installation`,
          price: finalDiscountedTotal
        }];
      }

      // Ensure all prices are positive
      breakdownItems = breakdownItems.filter(item => item.price !== 0).map(item => ({
        ...item,
        price: Math.abs(item.price) // Ensure all prices are positive for Stripe
      }));

      // Make sure we have at least one line item
      if (breakdownItems.length === 0) {
        breakdownItems = [{
          label: "Garage Floor Installation",
          price: finalDiscountedTotal
        }];
      }

      console.log('Final breakdown items for Stripe:', breakdownItems);

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
        customer_name: formData.name || 'Customer',
        customer_email: formData.email || '',
        customer_phone: formData.phone || '',
        installation_date: date ? format(date, "yyyy-MM-dd") : '',
        garage_capacity: formData.garageCapacity || 1,
        garage_finish: formData.garageFinish || 'standard',
        coupon_code: couponCode || 'none',
        discount_percentage: discountPercentage.toString(),
        submission_id: currentSubmissionId
      };

      console.log('Calling Stripe checkout with metadata:', metadata);
      console.log('Final price being processed:', finalDiscountedTotal);

      // Get session token for checkout security
      const sessionToken = getSessionTokenForCheckout();
      if (!sessionToken) {
        console.error('No session token available for checkout');
        toast({
          title: "Session Error",
          description: "Your session has expired. Please start over from the beginning.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create the checkout session
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          lineItems: lineItems,
          totalAmount: finalDiscountedTotal,
          metadata: metadata,
          successUrl: window.location.origin + '/success',
          cancelUrl: window.location.origin + '/step/9', // Return to payment step
          sessionToken: sessionToken,
        },
      });

      console.log('Stripe checkout response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Error creating checkout session');
      }

      if (data && data.url) {
        // Update submission with checkout session ID via edge function (handles RLS)
        if (data.sessionId) {
          console.log('Updating with checkout session ID:', data.sessionId);
          // Don't await this - let it run while we redirect
          updatePaymentInfo(date, data.sessionId, 'checkout_started').catch(err => {
            console.warn('Non-blocking update error:', err);
          });
        }
        
        // Redirect to Stripe Checkout immediately
        console.log('Redirecting to Stripe checkout URL:', data.url);
        window.location.assign(data.url);
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
