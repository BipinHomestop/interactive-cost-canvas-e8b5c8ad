// Canonical URL helper functions
export const BASE_DOMAIN = "https://costcalculator.americanconcretecoatings.com";

export const getCanonicalUrl = (path: string): string => {
  // Clean the path - remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Return base domain for root path
  if (!cleanPath || cleanPath === '') {
    return BASE_DOMAIN;
  }
  
  // Return full canonical URL
  return `${BASE_DOMAIN}/${cleanPath}`;
};

export const getStepCanonicalUrl = (stepNumber: number): string => {
  return getCanonicalUrl(`step/${stepNumber}`);
};