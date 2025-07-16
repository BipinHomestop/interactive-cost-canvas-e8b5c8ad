import { useEffect } from 'react';

/**
 * Dedicated hook to block canonical tags at runtime
 * This provides an additional layer of protection against canonical URLs
 */
export const useCanonicalBlocker = () => {
  useEffect(() => {
    // Immediate cleanup of any existing canonical tags
    const removeExistingCanonicals = () => {
      const canonicals = document.querySelectorAll('link[rel="canonical"]');
      canonicals.forEach(tag => {
        console.warn('Canonical blocker: Removed existing canonical tag:', tag);
        tag.remove();
      });
    };

    // Set up continuous monitoring
    const setupCanonicalMonitoring = () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as Element;
                
                // Direct canonical link check
                if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
                  console.error('CANONICAL BLOCKED: Direct canonical link detected and removed');
                  element.remove();
                }
                
                // Nested canonical link check
                if (element.querySelector) {
                  const nestedCanonicals = element.querySelectorAll('link[rel="canonical"]');
                  nestedCanonicals.forEach(canonical => {
                    console.error('CANONICAL BLOCKED: Nested canonical link detected and removed');
                    canonical.remove();
                  });
                }
              }
            });
          }
          
          // Check for attribute changes that might add canonical
          if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
            const element = mutation.target as Element;
            if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
              console.error('CANONICAL BLOCKED: Canonical attribute detected and element removed');
              element.remove();
            }
          }
        });
      });

      observer.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['rel']
      });

      return () => observer.disconnect();
    };

    // Override createElement to block canonical creation
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
      const element = originalCreateElement.call(this, tagName, options);
      
      // Block canonical link creation
      if (tagName.toLowerCase() === 'link') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name: string, value: string) {
          if (name === 'rel' && value === 'canonical') {
            console.error('CANONICAL BLOCKED: Attempted to create canonical link blocked');
            return;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };

    // Run initial cleanup
    removeExistingCanonicals();
    
    // Set up monitoring
    const cleanup = setupCanonicalMonitoring();
    
    // Periodic cleanup (every 5 seconds)
    const interval = setInterval(removeExistingCanonicals, 5000);

    return () => {
      cleanup();
      clearInterval(interval);
      // Restore original createElement
      document.createElement = originalCreateElement;
    };
  }, []);
};