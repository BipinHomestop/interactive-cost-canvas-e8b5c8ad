import DOMPurify from 'dompurify';

interface SanitizeOptions {
  allowedTags?: string[];
  stripHtml?: boolean;
}

export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(input: string, options: SanitizeOptions = {}): string {
    const { allowedTags = [], stripHtml = false } = options;
    
    if (stripHtml) {
      return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
    
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: [],
    });
  }

  /**
   * Sanitize text input to prevent injection attacks
   */
  static sanitizeText(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .replace(/[<>'"&]/g, (char) => {
        switch (char) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '"': return '&quot;';
          case "'": return '&#x27;';
          case '&': return '&amp;';
          default: return char;
        }
      });
  }

  /**
   * Validate and sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeText(email.toLowerCase());
    return emailRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Validate and sanitize phone numbers
   */
  static sanitizePhone(phone: string): string {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const sanitized = phone.replace(/[^\d\+]/g, '');
    return phoneRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Validate and sanitize ZIP codes
   */
  static sanitizeZipCode(zipCode: string): string {
    const zipRegex = /^[0-9]{5}(-[0-9]{4})?$/;
    const sanitized = zipCode.replace(/[^\d\-]/g, '');
    return zipRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Sanitize user names
   */
  static sanitizeName(name: string): string {
    const nameRegex = /^[a-zA-Z\s\-'\.]{1,100}$/;
    const sanitized = this.sanitizeText(name);
    return nameRegex.test(sanitized) ? sanitized : '';
  }

  /**
   * Rate limiting helper
   */
  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 900000): boolean {
    const now = Date.now();
    const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
    
    // Filter out attempts outside the time window
    const recentAttempts = attempts.filter((time: number) => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }
    
    // Add current attempt
    recentAttempts.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
    
    return true;
  }
}