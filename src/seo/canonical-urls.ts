/**
 * Canonical URL Configuration
 * Dynamically detects the current domain for canonical URLs
 */

/**
 * Hardcoded base domain for consistent SEO
 * This ensures canonical URLs match the sitemap exactly
 */
export const BASE_DOMAIN = 'https://quote.garagefloorcoatingsdfw.com';

/**
 * Get the current base domain - now hardcoded for SEO consistency
 */
export function getBaseDomain(): string {
  return BASE_DOMAIN;
}

/**
 * Hardcoded canonical URLs for consistent SEO
 * These URLs match exactly with the sitemap.xml
 */
export function getCanonicalUrls() {
  return {
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
}

/**
 * Get canonical URL for a given step number
 */
export function getCanonicalUrlForStep(step?: number): string {
  const urls = getCanonicalUrls();
  
  if (!step) {
    return urls.HOME;
  }
  
  const stepKey = `STEP_${step}` as keyof typeof urls;
  return urls[stepKey] || urls.HOME;
}

/**
 * Get canonical URL for a given route path
 */
export function getCanonicalUrlForRoute(pathname: string): string {
  const urls = getCanonicalUrls();
  
  // Remove trailing slash for consistency
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  
  switch (cleanPath) {
    case '/':
      return urls.HOME;
    case '/success':
      return urls.SUCCESS;
    case '/analytics':
      return urls.ANALYTICS;
    case '/admin':
      return urls.ADMIN;
    case '/admin/setup':
      return urls.ADMIN_SETUP;
    default:
      // Handle step URLs like /step/1, /step/2, etc.
      const stepMatch = cleanPath.match(/^\/step\/(\d+)$/);
      if (stepMatch) {
        const stepNumber = parseInt(stepMatch[1]);
        return getCanonicalUrlForStep(stepNumber);
      }
      
      // Fallback to home for unknown routes
      return urls.HOME;
  }
}
