import { useEffect } from 'react';

/**
 * Hook to set security-related meta tags.
 * Note: CSP is handled server-side via _headers file.
 * Client-side CSP meta tags can conflict with preview/iframe environments.
 */
export const useSecurityHeaders = () => {
  useEffect(() => {
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
