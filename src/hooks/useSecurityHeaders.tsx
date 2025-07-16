import { useEffect } from 'react';

/**
 * Hook to set security headers and CSP policies
 * Enhanced with canonical tag blocking
 */
export const useSecurityHeaders = () => {
  useEffect(() => {
    // CANONICAL TAG SECURITY BLOCKER
    const blockCanonicalTags = () => {
      // Remove any existing canonical tags immediately
      const existingCanonical = document.querySelectorAll('link[rel="canonical"]');
      existingCanonical.forEach(tag => {
        console.warn('Security: Canonical tag blocked and removed:', tag);
        tag.remove();
      });

      // Set up continuous monitoring for canonical tags
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                
                // Block canonical links
                if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
                  console.error('SECURITY ALERT: Canonical tag blocked:', element);
                  element.remove();
                }
                
                // Check for canonical links within added elements
                const canonicalLinks = element.querySelectorAll('link[rel="canonical"]');
                canonicalLinks.forEach(link => {
                  console.error('SECURITY ALERT: Canonical tag blocked:', link);
                  link.remove();
                });
              }
            });
          }
        });
      });

      observer.observe(document.head, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    };

    const canonicalBlocker = blockCanonicalTags();

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

    // Add anti-canonical meta tag
    const antiCanonical = document.createElement('meta');
    antiCanonical.setAttribute('name', 'canonical-blocked');
    antiCanonical.setAttribute('content', 'true');
    document.head.appendChild(antiCanonical);

    // Cleanup function
    return () => {
      canonicalBlocker();
    };
  }, []);
};