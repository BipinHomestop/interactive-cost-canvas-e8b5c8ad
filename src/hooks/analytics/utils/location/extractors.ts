
/**
 * Extract city from location string
 */
export const extractCityFromLocation = (location: string): string | null => {
  if (!location) return null;
  
  const parts = location.split(',');
  if (parts.length >= 1) {
    return parts[0].trim();
  }
  return null;
};

/**
 * Extract zip code from location string
 */
export const extractZipFromLocation = (location: string): string | null => {
  if (!location) return null;
  
  const zipMatch = location.match(/\b\d{5}\b/);
  if (zipMatch) {
    return zipMatch[0];
  }
  return null;
};
