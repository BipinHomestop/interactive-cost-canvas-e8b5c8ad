
export const validateZipCode = (location: string | undefined): boolean => {
  return /^\d{5}$/.test(location || '');
};

export const validateRequiredFields = (name?: string, phone?: string, email?: string): boolean => {
  return Boolean(name && phone && email);
};
