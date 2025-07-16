/**
 * Canonical URL Configuration
 * Base domain: https://quote.garagefloorcoatingsdfw.com
 */

export const BASE_DOMAIN = 'https://quote.garagefloorcoatingsdfw.com';

export const CANONICAL_URLS = {
  // Main calculator page (home)
  HOME: `${BASE_DOMAIN}/`,
  
  // Calculator steps
  STEP_1: `${BASE_DOMAIN}/step/1`,
  STEP_2: `${BASE_DOMAIN}/step/2`,
  STEP_3: `${BASE_DOMAIN}/step/3`,
  STEP_4: `${BASE_DOMAIN}/step/4`,
  STEP_5: `${BASE_DOMAIN}/step/5`,
  STEP_6: `${BASE_DOMAIN}/step/6`,
  STEP_7: `${BASE_DOMAIN}/step/7`,
  STEP_8: `${BASE_DOMAIN}/step/8`,
  STEP_9: `${BASE_DOMAIN}/step/9`,
  
  // Other pages
  SUCCESS: `${BASE_DOMAIN}/success`,
  ANALYTICS: `${BASE_DOMAIN}/analytics`,
  ADMIN: `${BASE_DOMAIN}/admin`,
  ADMIN_SETUP: `${BASE_DOMAIN}/admin/setup`,
} as const;

/**
 * Get canonical URL for a given step number
 */
export function getCanonicalUrlForStep(step?: number): string {
  if (!step) {
    return CANONICAL_URLS.HOME;
  }
  
  const stepKey = `STEP_${step}` as keyof typeof CANONICAL_URLS;
  return CANONICAL_URLS[stepKey] || CANONICAL_URLS.HOME;
}

/**
 * Get canonical URL for a given route path
 */
export function getCanonicalUrlForRoute(pathname: string): string {
  // Remove trailing slash for consistency
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  
  switch (cleanPath) {
    case '/':
      return CANONICAL_URLS.HOME;
    case '/success':
      return CANONICAL_URLS.SUCCESS;
    case '/analytics':
      return CANONICAL_URLS.ANALYTICS;
    case '/admin':
      return CANONICAL_URLS.ADMIN;
    case '/admin/setup':
      return CANONICAL_URLS.ADMIN_SETUP;
    default:
      // Handle step URLs like /step/1, /step/2, etc.
      const stepMatch = cleanPath.match(/^\/step\/(\d+)$/);
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1]);
        return getCanonicalUrlForStep(stepNumber);
      }
      
      // Fallback to home for unknown routes
      return CANONICAL_URLS.HOME;
  }
}
