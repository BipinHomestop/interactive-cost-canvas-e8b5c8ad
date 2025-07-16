import { useEffect } from 'react';

/**
 * Hook to set security headers and CSP policies
 */
export const useSecurityHeaders = () => {
  useEffect(() => {

    // Set Content Security Policy via meta tag
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCSP) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://tseksgdxfldgppzgfcwl.supabase.co https://ipapi.co https://geolocation-db.com https://api.ipgeolocation.io https://www.google-analytics.com",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '));
      document.head.appendChild(cspMeta);
    }

    // Set X-Frame-Options
    const existingFrameOptions = document.querySelector('meta[name="X-Frame-Options"]');
    if (!existingFrameOptions) {
      const frameOptionsMeta = document.createElement('meta');
      frameOptionsMeta.setAttribute('name', 'X-Frame-Options');
      frameOptionsMeta.setAttribute('content', 'DENY');
      document.head.appendChild(frameOptionsMeta);
    }

    // Set X-Content-Type-Options
    const existingContentType = document.querySelector('meta[name="X-Content-Type-Options"]');
    if (!existingContentType) {
      const contentTypeMeta = document.createElement('meta');
      contentTypeMeta.setAttribute('name', 'X-Content-Type-Options');
      contentTypeMeta.setAttribute('content', 'nosniff');
      document.head.appendChild(contentTypeMeta);
    }

    // Set Referrer Policy
    const existingReferrer = document.querySelector('meta[name="referrer"]');
    if (!existingReferrer) {
      const referrerMeta = document.createElement('meta');
      referrerMeta.setAttribute('name', 'referrer');
      referrerMeta.setAttribute('content', 'strict-origin-when-cross-origin');
      document.head.appendChild(referrerMeta);
    }

  }, []);
};