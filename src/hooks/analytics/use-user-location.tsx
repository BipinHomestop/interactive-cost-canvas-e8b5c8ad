
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
  const [fetchAttempts, setFetchAttempts] = useState<number>(0);
  
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
    try {
      // Always track the page view, even without location data
      await logPageVisit(pagePath, userLocationData, timeRange);
      
      // Only try to fetch location if we haven't already
      if (userLocationData.city === 'Unknown' && fetchAttempts < 3) {
        setFetchAttempts(prev => prev + 1);
        try {
          const locationData = await fetchUserLocation();
          setUserLocationData(locationData);
          
          // If we got real location data, update the visit
          if (locationData.city !== 'Unknown') {
            await logPageVisit(pagePath, locationData, timeRange);
          }
        } catch (error) {
          console.error('Error fetching location for page view:', error);
          // Continue with the default unknown location
        }
      }
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  };

  const fetchUserLocation = async (): Promise<UserLocationData> => {
    try {
      // Try multiple location APIs for redundancy
      const apis = [
        'https://ipapi.co/json/',
        'https://ipinfo.io/json?token=ce8a5473d4c202', // Demo token, for production use a proper token
        'https://geolocation-db.com/json/'
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

  const logPageVisit = async (
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
  }, [timeRange, location.pathname]);

  return { 
    userLocationData,
    isLoading,
    trackPageView
  };
};
