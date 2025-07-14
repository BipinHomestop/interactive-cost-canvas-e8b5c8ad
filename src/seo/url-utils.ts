// Dynamic URL detection and generation utilities

/**
 * Detects the current base URL dynamically from the browser environment
 * Falls back to a default if running in SSR or Node environment
 */
export function detectBaseUrl(): string {
  // Browser environment
  if (typeof window !== 'undefined') {
    const { protocol, host } = window.location;
    return `${protocol}//${host}`;
  }
  
  // Server-side or Node environment fallback
  // Try to get from environment variables first
  const envUrl = process.env.VITE_APP_URL || process.env.PUBLIC_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
  }
  
  // Ultimate fallback - this should be replaced with actual domain
  return 'https://quote.garagefloorcoatingsdfw.com';
}

/**
 * Generates a full URL for any path using dynamic base URL detection
 */
export function generateDynamicUrl(path?: string | number): string {
  const baseUrl = detectBaseUrl();
  
  if (!path) {
    return `${baseUrl}/`; // Homepage with trailing slash
  }
  
  if (typeof path === 'number') {
    return `${baseUrl}/step/${path}`;
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Gets the current page URL including search params and hash
 */
export function getCurrentPageUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return generateDynamicUrl();
}

/**
 * URL configuration that can be overridden via environment variables
 */
export const urlConfig = {
  // Default domain - can be overridden by VITE_APP_URL
  defaultDomain: 'quote.garagefloorcoatingsdfw.com',
  
  // Default protocol
  defaultProtocol: 'https',
  
  // Get the configured base URL
  getBaseUrl(): string {
    return detectBaseUrl();
  },
  
  // Generate URLs for specific pages
  generateUrl(path?: string | number): string {
    return generateDynamicUrl(path);
  }
};