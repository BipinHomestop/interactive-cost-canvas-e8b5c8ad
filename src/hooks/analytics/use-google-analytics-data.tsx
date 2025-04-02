
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
        
        // Check if running in browser environment
        if (typeof window === 'undefined') {
          console.log('Running in server environment, GA not available');
          setError('Google Analytics is not available in server environment');
          setIsGaLoading(false);
          return;
        }

        // Check if Google Analytics script is loaded
        if (!window.gtag) {
          console.log('Google Analytics not initialized');
          setError('Google Analytics is not properly configured');
          setIsGaLoading(false);
          return;
        }

        // Mock data for demonstration 
        const mockData: GoogleAnalyticsPageData[] = [
          {
            pagePath: '/',
            pageViews: 1250,
            uniqueViews: 980,
            avgTimeOnPage: '2m 35s',
            bounceRate: 42.3
          },
          {
            pagePath: '/step/1',
            pageViews: 870,
            uniqueViews: 720,
            avgTimeOnPage: '1m 45s',
            bounceRate: 38.5
          },
          {
            pagePath: '/step/2',
            pageViews: 630,
            uniqueViews: 540,
            avgTimeOnPage: '2m 10s',
            bounceRate: 45.2
          },
          {
            pagePath: '/success',
            pageViews: 410,
            uniqueViews: 390,
            avgTimeOnPage: '1m 20s',
            bounceRate: 28.7
          },
          {
            pagePath: '/analytics',
            pageViews: 220,
            uniqueViews: 150,
            avgTimeOnPage: '3m 45s',
            bounceRate: 15.2
          }
        ];

        // Simulate GA connection check
        const measurementId = 'G-773SG7LPWC';
        
        try {
          // Attempt to get client ID to verify connection
          window.gtag('get', measurementId, 'client_id', (clientId: string) => {
            if (clientId) {
              console.log('GA connected, client ID available:', clientId);
              setIsConnected(true);
              
              // Use mock data for demonstration
              setPageTrafficData(mockData);
              setTotalUsers(2845);
              setIsGaLoading(false);
            } else {
              console.log('GA connected but no client ID');
              setIsConnected(false);
              setError('Google Analytics is connected but not returning data.');
              setIsGaLoading(false);
            }
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
