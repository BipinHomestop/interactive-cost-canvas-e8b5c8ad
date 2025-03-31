
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CalculatorInputs } from "@/components/calculator/types";

export const useSubmission = () => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { toast } = useToast();

  const saveSubmission = async (
    formValues: CalculatorInputs, 
    isNewSubmission: boolean = true,
    totalPrice?: number,
    discountCode?: string,
    discountPercentage?: number
  ) => {
    try {
      if (isNewSubmission) {
        const { data, error } = await supabase
          .from('cost_calculator_submissions')
          .insert([{
            location: formValues.location,
            name: formValues.name,
            phone: formValues.phone,
            email: formValues.email,
            garage_capacity: formValues.garageCapacity,
            garage_finish: formValues.garageFinish,
            need_stem_walls: formValues.needStemWalls,
            stem_wall_type: formValues.stemWallType,
            need_steps: formValues.needSteps,
            need_extra_footage: formValues.needExtraFootage,
            extra_footage: formValues.extraFootage,
            current_condition: formValues.currentCondition,
            total_price: totalPrice,
            discount_code: discountCode,
            discount_percentage: discountPercentage,
            payment_status: 'pending'
          }])
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setSubmissionId(data[0].id);
        }

        toast({
          title: "Success",
          description: "Your information has been saved",
          className: "bg-green-500 text-white border-none",
        });
      } else if (submissionId) {
        const { error } = await supabase
          .from('cost_calculator_submissions')
          .update({
            garage_capacity: formValues.garageCapacity,
            garage_finish: formValues.garageFinish,
            need_stem_walls: formValues.needStemWalls,
            stem_wall_type: formValues.stemWallType,
            need_steps: formValues.needSteps,
            need_extra_footage: formValues.needExtraFootage,
            extra_footage: formValues.extraFootage,
            current_condition: formValues.currentCondition,
            total_price: totalPrice,
            discount_code: discountCode,
            discount_percentage: discountPercentage
          })
          .eq('id', submissionId);

        if (error) throw error;
      }
      return true;
    } catch (error) {
      console.error('Error saving/updating data:', error);
      toast({
        title: "Error",
        description: isNewSubmission ? "Failed to save your information" : "Failed to update your information",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePaymentInfo = async (
    preferredInstallationDate?: Date,
    checkoutSessionId?: string,
    paymentStatus?: string
  ) => {
    if (!submissionId) return false;
    
    try {
      const { error } = await supabase
        .from('cost_calculator_submissions')
        .update({
          preferred_installation_date: preferredInstallationDate,
          checkout_session_id: checkoutSessionId,
          payment_status: paymentStatus || 'processing'
        })
        .eq('id', submissionId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating payment information:', error);
      return false;
    }
  };

  return { submissionId, saveSubmission, updatePaymentInfo };
};
