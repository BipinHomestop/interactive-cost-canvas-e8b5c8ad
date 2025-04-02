
import { useState, useEffect } from 'react';

interface GoogleAnalyticsPageData {
  pagePath: string;
  pageViews: number;
  uniqueViews: number;
  avgTimeOnPage: string;
  bounceRate: number;
}

export const useGoogleAnalyticsData = (timeRange: string = '30d') => {
  const [pageTrafficData, setPageTrafficData] = useState<GoogleAnalyticsPageData[]>([]);
  const [isGaLoading, setIsGaLoading] = useState<boolean>(true);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const fetchGoogleAnalyticsData = async () => {
      try {
        setIsGaLoading(true);
        setError(null);
        
        // Check if GA is available and properly initialized
        if (typeof window === 'undefined') {
          console.log('Running in server environment, GA not available');
          setError('Google Analytics is not available in server environment');
          setIsGaLoading(false);
          return;
        }

        if (!window.gtag) {
          console.log('Google Analytics not initialized');
          setError('Google Analytics is not properly configured');
          setIsGaLoading(false);
          return;
        }

        // Check if GA is properly connected by attempting to access a property
        try {
          // In a real app, we would make an API call to Google Analytics Data API
          // For now, we check if we can get any data through gtag
          // Fix: The gtag 'get' command only accepts 3 arguments, not 4
          window.gtag('get', 'G-773SG7LPWC', (clientId: string) => {
            if (clientId) {
              console.log('GA connected, client ID available:', clientId);
              setIsConnected(true);
              
              // In a real implementation, we would fetch page data here
              // For now, we'll set empty data since we don't have actual access
              setPageTrafficData([]);
              setTotalUsers(0);
              setError('To view Google Analytics data, please connect your account.');
            } else {
              console.log('GA connected but no client ID');
              setIsConnected(false);
              setError('Google Analytics is connected but not returning data.');
            }
            setIsGaLoading(false);
          });
        } catch (err) {
          console.error('Error checking Google Analytics connection:', err);
          setIsConnected(false);
          setError('Error verifying Google Analytics connection');
          setIsGaLoading(false);
        }
      } catch (err) {
        console.error('Error in Google Analytics data fetch:', err);
        setError('Failed to fetch Google Analytics data');
        setIsGaLoading(false);
      }
    };

    fetchGoogleAnalyticsData();
  }, [timeRange]);

  return { 
    pageTrafficData,
    isGaLoading,
    totalUsers,
    error,
    isConnected
  };
};
