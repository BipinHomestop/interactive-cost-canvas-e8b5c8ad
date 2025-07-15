/**
 * Canonical Tag Blocker Utility
 * Provides comprehensive blocking of canonical URLs
 */

export class CanonicalBlocker {
  private static instance: CanonicalBlocker;
  private observer: MutationObserver | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private isBlocking = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): CanonicalBlocker {
    if (!CanonicalBlocker.instance) {
      CanonicalBlocker.instance = new CanonicalBlocker();
    }
    return CanonicalBlocker.instance;
  }

  private initialize(): void {
    if (this.isBlocking) return;
    
    this.isBlocking = true;
    
    // Immediate cleanup
    this.removeExistingCanonicals();
    
    // Set up continuous monitoring
    this.setupMutationObserver();
    
    // Periodic cleanup
    this.setupPeriodicCleanup();
    
    // Override DOM methods
    this.overrideDOMMethods();
    
    console.log('Canonical Blocker initialized - All canonical URLs blocked');
  }

  private removeExistingCanonicals(): void {
    const canonicals = document.querySelectorAll('link[rel="canonical"]');
    canonicals.forEach(tag => {
      console.warn('Canonical Blocker: Removed existing canonical tag');
      tag.remove();
    });
  }

  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.checkAndBlockCanonical(node as Element);
            }
          });
        }
        
        if (mutation.type === 'attributes' && mutation.target.nodeType === Node.ELEMENT_NODE) {
          const element = mutation.target as Element;
          if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
            console.error('Canonical Blocker: Attribute-based canonical blocked');
            element.remove();
          }
        }
      });
    });

    this.observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['rel']
    });
  }

  private checkAndBlockCanonical(element: Element): void {
    // Direct canonical check
    if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
      console.error('Canonical Blocker: Direct canonical link blocked');
      element.remove();
      return;
    }

    // Nested canonical check
    if (element.querySelector) {
      const nestedCanonicals = element.querySelectorAll('link[rel="canonical"]');
      nestedCanonicals.forEach(canonical => {
        console.error('Canonical Blocker: Nested canonical link blocked');
        canonical.remove();
      });
    }
  }

  private setupPeriodicCleanup(): void {
    this.intervalId = setInterval(() => {
      this.removeExistingCanonicals();
    }, 3000); // Check every 3 seconds
  }

  private overrideDOMMethods(): void {
    // Override createElement
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
      const element = originalCreateElement.call(this, tagName, options);
      
      if (tagName.toLowerCase() === 'link') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name: string, value: string) {
          if (name === 'rel' && value === 'canonical') {
            console.error('Canonical Blocker: createElement canonical blocked');
            return;
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };

    // Override appendChild
    const originalAppendChild = document.head.appendChild;
    document.head.appendChild = function<T extends Node>(newChild: T): T {
      if (newChild.nodeType === Node.ELEMENT_NODE) {
        const element = newChild as unknown as Element;
        if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
          console.error('Canonical Blocker: appendChild canonical blocked');
          return newChild;
        }
      }
      return originalAppendChild.call(this, newChild);
    };

    // Override insertBefore
    const originalInsertBefore = document.head.insertBefore;
    document.head.insertBefore = function<T extends Node>(newChild: T, refChild: Node | null): T {
      if (newChild.nodeType === Node.ELEMENT_NODE) {
        const element = newChild as unknown as Element;
        if (element.tagName === 'LINK' && element.getAttribute('rel') === 'canonical') {
          console.error('Canonical Blocker: insertBefore canonical blocked');
          return newChild;
        }
      }
      return originalInsertBefore.call(this, newChild, refChild);
    };
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isBlocking = false;
    console.log('Canonical Blocker destroyed');
  }

  public forceCleanup(): void {
    this.removeExistingCanonicals();
    console.log('Canonical Blocker: Force cleanup executed');
  }
}

// Initialize the blocker immediately
export const canonicalBlocker = CanonicalBlocker.getInstance();

// Export utility function
export const blockCanonicalTags = () => {
  return CanonicalBlocker.getInstance();
};