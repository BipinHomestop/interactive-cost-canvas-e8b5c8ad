
import { useState, useEffect, useRef } from 'react';
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
  const hasInitialized = useRef(false);
  const trackedPaths = useRef<Set<string>>(new Set());
  
  const location = useLocation();

  // Track page views - only once per unique path per session
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Skip if already tracked this path
    if (trackedPaths.current.has(currentPath)) {
      return;
    }
    
    // Track in Google Analytics only (skip failing Supabase analytics)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: currentPath,
        send_to: 'G-773SG7LPWC'
      });
    }
    
    trackedPaths.current.add(currentPath);
  }, [location.pathname]);

  // Initially fetch user location on mount - only once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initializeLocationTracking = async () => {
      try {
        setIsLoading(true);
        const locationData = await fetchUserLocation();
        setUserLocationData(locationData);
        
        // Try to log initial visit silently (don't block on failure)
        logPageVisit(location.pathname, locationData, timeRange).catch(() => {});
      } catch (error) {
        // Silently fail - location tracking is not critical
        console.log('Location tracking unavailable');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeLocationTracking();
  }, []);

  const trackPageView = async (pagePath: string) => {
    // Only track in GA, skip Supabase analytics to avoid RLS errors
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pagePath,
        page_location: window.location.href
      });
    }
  };

  return { 
    userLocationData,
    isLoading,
    trackPageView
  };
};
