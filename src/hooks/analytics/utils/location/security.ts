
// Create a hash of the IP address for privacy reasons
export const createIPHash = async (ip: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + 'garagefloorcoating-salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Error creating IP hash:', error);
    return 'hash-error';
  }
};
