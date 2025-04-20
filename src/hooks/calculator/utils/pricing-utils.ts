
// Helper function to determine a fallback price based on garage capacity
export const determineFallbackPrice = (garageCapacity?: number): number => {
  if (!garageCapacity || garageCapacity <= 0) {
    return 2000; // Default fallback price
  }
  
  // Price tiers based on garage capacity
  const priceTiers: Record<number, number> = {
    1: 1000,
    2: 2200,
    3: 3500,
    4: 5000,
    5: 6500
  };
  
  return priceTiers[garageCapacity] || 2000;
};
