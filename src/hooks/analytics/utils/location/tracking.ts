
import { supabase } from '@/integrations/supabase/client';
import { UserLocationData } from '../../types/location-types';
import { createIPHash } from './security';

export const logPageVisit = async (
  pagePath: string,
  locationData: UserLocationData,
  timeRange: string
) => {
  try {
    // Hash the IP address for privacy
    const ipHash = await createIPHash(locationData.ip);
    
    const currentPage = pagePath.split('/').pop() || 'home';
    
    const { error, data } = await supabase
      .from('analytics_location_visits')
      .insert({
        city: locationData.city,
        zipcode: locationData.zipcode,
        region: locationData.region,
        country: locationData.country,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        ip_hash: ipHash,
        visit_date: new Date().toISOString().split('T')[0],
        visit_time: new Date().toTimeString().split(' ')[0],
        time_range: timeRange,
        page_visited: currentPage
      })
      .select();
  
    if (error) {
      console.error('Error logging location visit:', error);
      // Try again with a public instead of authenticated call
      if (error.code === '42501') { // Permission denied
        console.log('Trying public insert as fallback...');
        const { error: publicError } = await supabase.auth.signOut();
        if (publicError) {
          console.error('Error signing out:', publicError);
        }
        
        const { error: retryError } = await supabase
          .from('analytics_location_visits')
          .insert({
            city: locationData.city,
            zipcode: locationData.zipcode,
            region: locationData.region,
            country: locationData.country,
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            ip_hash: ipHash,
            visit_date: new Date().toISOString().split('T')[0],
            visit_time: new Date().toTimeString().split(' ')[0],
            time_range: timeRange,
            page_visited: currentPage
          });
          
        if (retryError) {
          console.error('Error on retry for logging visit:', retryError);
          return false;
        }
      } else {
        return false;
      }
    }
    
    console.log('Analytics visit logged successfully for:', currentPage, data);
    return true;
  } catch (err) {
    console.error('Failed to log location visit:', err);
    return false;
  }
};
