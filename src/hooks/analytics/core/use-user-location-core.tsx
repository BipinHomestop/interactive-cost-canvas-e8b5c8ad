
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUserLocation } from '../utils/location/fetchers';
import { logPageVisit } from '../utils/location/tracking';
import { UserLocationData } from '../types/location-types';

export const useUserLocationCore = (timeRange: string = '30d') => {
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
