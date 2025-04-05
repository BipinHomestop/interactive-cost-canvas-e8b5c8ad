
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
