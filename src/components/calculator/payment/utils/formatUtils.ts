
/**
 * Formats a finish label from kebab-case to Title Case
 * Example: "cabin-fever" becomes "Cabin Fever"
 */
export const formatFinishLabel = (finish: string): string => {
  return finish
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formats a date to a human-readable string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats a price to a currency string
 */
export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

/**
 * Formats a discount percentage to a string with % sign
 */
export const formatDiscount = (percentage: number): string => {
  return `${percentage}%`;
};
