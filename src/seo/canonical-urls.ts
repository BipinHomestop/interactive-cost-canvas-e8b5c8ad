/**
 * Canonical URL Configuration
 * Dynamically detects the current domain for canonical URLs
 */

/**
 * Get the current base domain dynamically
 */
export function getBaseDomain(): string {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : '';
    return `${protocol}//${hostname}${portSuffix}`;
  }
  
  // Return empty string for SSR - canonical URLs will be set client-side
  return '';
}

/**
 * Get canonical URLs dynamically based on current domain
 */
export function getCanonicalUrls() {
  const baseDomain = getBaseDomain();
  
  return {
    // Main calculator page (home)
    HOME: `${baseDomain}/`,
    
    // Calculator steps
    STEP_1: `${baseDomain}/step/1`,
    STEP_2: `${baseDomain}/step/2`,
    STEP_3: `${baseDomain}/step/3`,
    STEP_4: `${baseDomain}/step/4`,
    STEP_5: `${baseDomain}/step/5`,
    STEP_6: `${baseDomain}/step/6`,
    STEP_7: `${baseDomain}/step/7`,
    STEP_8: `${baseDomain}/step/8`,
    STEP_9: `${baseDomain}/step/9`,
    
    // Other pages
    SUCCESS: `${baseDomain}/success`,
    ANALYTICS: `${baseDomain}/analytics`,
    ADMIN: `${baseDomain}/admin`,
    ADMIN_SETUP: `${baseDomain}/admin/setup`,
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
