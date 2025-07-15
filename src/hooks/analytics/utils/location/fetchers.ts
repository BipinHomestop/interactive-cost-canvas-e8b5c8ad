
import { UserLocationData } from '../../types/location-types';

export const fetchUserLocation = async (): Promise<UserLocationData> => {
  try {
    // Try multiple location APIs for redundancy (using free APIs without tokens)
    const apis = [
      'https://ipapi.co/json/',
      'https://geolocation-db.com/json/',
      'https://api.ipgeolocation.io/ipgeo?apiKey=free' // Free tier API
    ];
    
    // Try each API until one works
    for (const api of apis) {
      try {
        const response = await fetch(api, { 
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000) // 3-second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Different APIs have slightly different response formats
          const locationData = {
            latitude: data.latitude || data.lat || null,
            longitude: data.longitude || data.lon || null,
            city: data.city || 'Unknown',
            region: data.region || data.region_name || data.state || 'Unknown',
            country: data.country_name || data.country || 'Unknown',
            ip: data.ip || 'Unknown',
            zipcode: data.postal || data.zip || data.postal_code || 'Unknown'
          };
          
          console.log('Location data retrieved:', locationData);
          return locationData;
        }
      } catch (apiError) {
        console.error(`Error fetching from ${api}:`, apiError);
        // Continue to next API
      }
    }
    
    throw new Error('All location APIs failed');
  } catch (error) {
    console.error('Error fetching location data:', error);
    return {
      latitude: null,
      longitude: null,
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      ip: 'Unknown',
      zipcode: 'Unknown'
    };
  }
};
