
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserLocation = (timeRange: string) => {
  const [userLocationData, setUserLocationData] = useState({
    latitude: null,
    longitude: null,
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    ip: 'Unknown'
  });

  const trackUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        
        setUserLocationData({
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country_name || 'Unknown',
          ip: data.ip || 'Unknown'
        });
        
        if (data.city && data.postal) {
          logLocationVisit(data.city, data.postal, data.region, data.country_name, data.ip);
        }
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const logLocationVisit = async (
    city: string, 
    zipCode: string, 
    region: string, 
    country: string,
    ip: string
  ) => {
    try {
      // Hash the IP address for privacy
      const ipHash = await createIPHash(ip);
      
      const { error } = await supabase
        .from('analytics_location_visits')
        .insert({
          city: city,
          zipcode: zipCode,
          region: region,
          country: country,
          ip_hash: ipHash,
          visit_date: new Date().toISOString().split('T')[0],
          visit_time: new Date().toTimeString().split(' ')[0],
          time_range: timeRange,
          page_visited: 'analytics'
        });
    
      if (error) console.error('Error logging location visit:', error);
    } catch (err) {
      console.error('Failed to log location visit:', err);
    }
  };

  // Create a hash of the IP address for privacy reasons
  const createIPHash = async (ip: string): Promise<string> => {
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

  useEffect(() => {
    trackUserLocation();
  }, []);

  return { userLocationData };
};
