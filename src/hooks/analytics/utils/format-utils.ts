
/**
 * Format page names to be more readable
 */
export const formatPageName = (pageName: string): string => {
  if (!pageName) return 'Unknown';
  
  switch (pageName.toLowerCase()) {
    case 'garagefinish':
      return 'Garage Finish Selection';
    case 'garagecapacity':
      return 'Garage Capacity';
    case 'stemwalls':
      return 'Stem Walls';
    case 'housesteps':
      return 'House Steps';
    case 'additionalfootage':
      return 'Additional Footage';
    case 'currentcondition':
      return 'Current Condition';
    case 'contact':
      return 'Contact Form';
    case 'payment':
      return 'Payment';
    case 'analytics':
      return 'Analytics Dashboard';
    default:
      return pageName.charAt(0).toUpperCase() + pageName.slice(1);
  }
};

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
