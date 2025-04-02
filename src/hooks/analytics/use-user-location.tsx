
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';

interface UserLocationData {
  latitude: number | null;
  longitude: number | null;
  city: string;
  region: string;
  country: string;
  ip: string;
  zipcode: string;
}

export const useUserLocation = (timeRange: string = '30d') => {
  const [userLocationData, setUserLocationData] = useState<UserLocationData>({
    latitude: null,
    longitude: null,
    city: 'Unknown',
    region: 'Unknown',
    country: 'Unknown',
    ip: 'Unknown',
    zipcode: 'Unknown'
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Track page views
  useEffect(() => {
    // Track page view in our own analytics system
    trackPageView(location.pathname);
    
    // Additionally track in Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
        send_to: 'G-773SG7LPWC'
      });
      console.log('Analytics page view tracked:', location.pathname);
    }
  }, [location.pathname]);

  const trackPageView = async (pagePath: string) => {
    // Check if we already have location data
    let locationData = userLocationData;
    
    if (locationData.city === 'Unknown') {
      try {
        // Try to get location data
        setIsLoading(true);
        locationData = await fetchUserLocation();
        setUserLocationData(locationData);
      } catch (error) {
        console.error('Error fetching location for page view:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Log the page visit with the location data we have
    await logPageVisit(pagePath, locationData, timeRange);
  };

  const fetchUserLocation = async (): Promise<UserLocationData> => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        
        const locationData = {
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          country: data.country_name || 'Unknown',
          ip: data.ip || 'Unknown',
          zipcode: data.postal || 'Unknown'
        };
        
        return locationData;
      }
      throw new Error('Failed to fetch location data');
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

  const logPageVisit = async (
    pagePath: string,
    locationData: UserLocationData,
    timeRange: string
  ) => {
    try {
      // Hash the IP address for privacy
      const ipHash = await createIPHash(locationData.ip);
      
      const currentPage = pagePath.split('/').pop() || 'home';
      
      const { error } = await supabase
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
    
      if (error) {
        console.error('Error logging location visit:', error);
        return false;
      }
      
      console.log('Analytics visit logged successfully for:', currentPage);
      return true;
    } catch (err) {
      console.error('Failed to log location visit:', err);
      return false;
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

  // Initially fetch user location on mount
  useEffect(() => {
    const initializeLocationTracking = async () => {
      try {
        setIsLoading(true);
        const locationData = await fetchUserLocation();
        setUserLocationData(locationData);
        
        // Log the initial visit
        await logPageVisit(location.pathname, locationData, timeRange);
      } catch (error) {
        console.error('Error initializing location tracking:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeLocationTracking();
    
    // Refresh location data periodically
    const locationTimer = setInterval(() => {
      fetchUserLocation().then(locationData => {
        setUserLocationData(locationData);
      });
    }, 30 * 60 * 1000); // Every 30 minutes
    
    return () => clearInterval(locationTimer);
  }, []);

  return { 
    userLocationData,
    isLoading,
    trackPageView
  };
};
