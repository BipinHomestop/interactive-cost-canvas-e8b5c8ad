
/**
 * Utility functions for validating form inputs
 */

/**
 * Validates that a ZIP code is in the correct format (exactly 5 digits)
 */
export const isValidZipCode = (zipcode: string | undefined): boolean => {
  if (!zipcode) return false;
  return /^\d{5}$/.test(zipcode); // Must be exactly 5 digits
};

/**
 * Validates that a phone number is in the correct format (10 digits)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Clean the input from any non-digit characters
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Check if it has exactly 10 digits for US phone numbers
  return cleanedPhone.length === 10;
};
