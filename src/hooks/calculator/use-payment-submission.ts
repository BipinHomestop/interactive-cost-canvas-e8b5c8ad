
import { useToast } from "@/components/ui/use-toast";
import { getPreservedCalculationData } from "./utils/submission-db";
import { updatePaymentInfo as updatePaymentInfoDb } from "./utils/submission-db";

export const usePaymentSubmission = (submissionId: string | null) => {
  const { toast } = useToast();

  const updatePaymentInfo = async (
    preferredInstallationDate?: Date,
    checkoutSessionId?: string,
    paymentStatus?: string
  ) => {
    // Try to use stored ID if not available in state
    const idToUse = submissionId || sessionStorage.getItem('calculatorSubmissionId');
    
    if (!idToUse) {
      console.error('No submission ID found for payment update');
      toast({
        title: "Error",
        description: "Session information is missing. Please refresh the page and try again.",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      console.log('Updating payment info with:', {
        id: idToUse,
        date: preferredInstallationDate,
        sessionId: checkoutSessionId,
        status: paymentStatus
      });
      
      // Convert Date object to ISO string format before sending to the database
      const formattedDate = preferredInstallationDate 
        ? new Date(preferredInstallationDate.getTime() - (preferredInstallationDate.getTimezoneOffset() * 60000))
            .toISOString().split('T')[0]
        : undefined;
      
      const updateData: Record<string, any> = {};
      
      if (formattedDate) updateData.preferred_installation_date = formattedDate;
      if (checkoutSessionId) updateData.checkout_session_id = checkoutSessionId;
      if (paymentStatus) updateData.payment_status = paymentStatus;
      
      // Ensure we have a valid price when updating payment info
      const preservedPrice = getPreservedCalculationData();
      if (preservedPrice && preservedPrice > 0) {
        updateData.total_price = preservedPrice;
        console.log('Including preserved price in payment update:', preservedPrice);
      }
      
      const { error } = await updatePaymentInfoDb(idToUse, updateData);

      if (error) {
        console.error('Payment info update error:', error);
        throw error;
      }
      
      console.log('Successfully updated payment info for submission:', idToUse);
      return true;
    } catch (error) {
      console.error('Error updating payment information:', error);
      toast({
        title: "Error",
        description: "Failed to update payment information. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { updatePaymentInfo };
};
