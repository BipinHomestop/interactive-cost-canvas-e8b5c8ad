import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCanonicalUrlForRoute } from './canonical-urls';

/**
 * SEO Validator Component
 * Ensures canonical URLs are properly set and validates SEO implementation
 * This component runs validation checks to ensure SEO tags are working correctly
 */
export const SEOValidator: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Validate canonical URL is properly set
    const canonicalUrl = getCanonicalUrlForRoute(location.pathname);
    const canonicalElement = document.querySelector('link[rel="canonical"]');
    
    if (canonicalElement) {
      const currentHref = canonicalElement.getAttribute('href');
      
      // Log for debugging (only in development)
      if (import.meta.env.DEV) {
        console.log('🔍 SEO Validator:', {
          pathname: location.pathname,
          expectedCanonical: canonicalUrl,
          actualCanonical: currentHref,
          match: currentHref === canonicalUrl
        });
      }
      
      // Ensure canonical URL is properly hardcoded
      if (currentHref !== canonicalUrl) {
        console.warn('⚠️ Canonical URL mismatch detected:', {
          expected: canonicalUrl,
          actual: currentHref
        });
      }
    } else {
      console.error('❌ Canonical URL not found in document head');
    }

    // Validate Open Graph URL
    const ogUrlElement = document.querySelector('meta[property="og:url"]');
    if (ogUrlElement) {
      const ogUrl = ogUrlElement.getAttribute('content');
      if (ogUrl !== canonicalUrl) {
        console.warn('⚠️ Open Graph URL mismatch:', {
          canonical: canonicalUrl,
          ogUrl: ogUrl
        });
      }
    }

    // Validate Twitter URL
    const twitterUrlElement = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrlElement) {
      const twitterUrl = twitterUrlElement.getAttribute('content');
      if (twitterUrl !== canonicalUrl) {
        console.warn('⚠️ Twitter URL mismatch:', {
          canonical: canonicalUrl,
          twitterUrl: twitterUrl
        });
      }
    }

    // No additional meta tag manipulation - respect hardcoded canonical tags only
  }, [location.pathname]);

  return null; // This component doesn't render anything
};

/**
 * SEO Debug Component - Only renders in development
 * Displays current SEO information for debugging
 */
export const SEODebug: React.FC = () => {
  const location = useLocation();
  
  if (!import.meta.env.DEV) {
    return null;
  }

  const canonicalUrl = getCanonicalUrlForRoute(location.pathname);

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: '#000',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px',
        opacity: 0.8
      }}
    >
      <strong>SEO Debug:</strong><br />
      <small>Path: {location.pathname}</small><br />
      <small>Canonical: {canonicalUrl}</small><br />
      <small>Domain: https://quote.garagefloorcoatingsdfw.com</small>
    </div>
  );
};