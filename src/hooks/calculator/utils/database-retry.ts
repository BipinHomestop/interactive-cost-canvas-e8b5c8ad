/**
 * Database retry utility for handling Supabase connection issues
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2
};

/**
 * Executes a database operation with exponential backoff retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error;
  
  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on the last attempt
      if (attempt === opts.maxRetries) {
        console.error(`Database operation failed after ${opts.maxRetries} retries:`, error);
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.baseDelay * Math.pow(opts.backoffFactor, attempt),
        opts.maxDelay
      );
      
      console.warn(`Database operation failed (attempt ${attempt + 1}/${opts.maxRetries + 1}), retrying in ${delay}ms:`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Enhanced error handling for Supabase operations
 */
export function handleDatabaseError(error: any, operation: string): Error {
  const errorMessage = error?.message || 'Unknown database error';
  
  // Log the error with context
  console.error(`Database error in ${operation}:`, {
    message: errorMessage,
    code: error?.code,
    details: error?.details,
    hint: error?.hint
  });
  
  // Return a user-friendly error
  return new Error(`Failed to ${operation}: ${errorMessage}`);
}