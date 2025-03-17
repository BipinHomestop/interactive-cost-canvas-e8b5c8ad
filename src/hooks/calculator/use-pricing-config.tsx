
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface PricingConfig {
  config_key: string;
  config_value: number;
  display_name: string;
  description?: string;
}

export const usePricingConfig = () => {
  const [pricingConfig, setPricingConfig] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPricingConfig = async () => {
      try {
        console.log("Fetching pricing configuration from Supabase...");
        const { data, error } = await supabase
          .from('calculator_pricing_config')
          .select('config_key, config_value');

        if (error) throw error;

        // Convert array of configs to a key-value object for easier access
        const configMap: Record<string, number> = {};
        data.forEach((item: PricingConfig) => {
          configMap[item.config_key] = Number(item.config_value);
        });

        console.log("Received pricing configuration:", configMap);
        setPricingConfig(configMap);
      } catch (err) {
        console.error('Error fetching pricing configuration:', err);
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load pricing information. Default values will be used.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricingConfig();
  }, [toast]);

  // Helper function to get a config value with a fallback
  const getPrice = useCallback((key: string, fallback: number): number => {
    if (pricingConfig[key] !== undefined) {
      return pricingConfig[key];
    }
    return fallback;
  }, [pricingConfig]);

  // Get finish multiplier for a specific finish type
  const getFinishMultiplier = useCallback((finishType: string): number => {
    const configKey = `finish_multiplier_${finishType.replace(/-/g, '_')}`;
    const multiplier = getPrice(configKey, 1.0);
    console.log(`Finish multiplier for ${finishType}: ${multiplier}`);
    return multiplier;
  }, [getPrice]);

  return {
    pricingConfig,
    isLoading,
    error,
    getPrice,
    getFinishMultiplier
  };
};
