
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

  useEffect(() => {
    const fetchGoogleAnalyticsData = async () => {
      try {
        setIsGaLoading(true);
        setError(null);
        
        // Check if GA is available
        if (typeof window === 'undefined' || !window.gtag) {
          console.log('Google Analytics not available');
          setPageTrafficData([]);
          setTotalUsers(0);
          setError('Google Analytics is not configured');
          setIsGaLoading(false);
          return;
        }

        // In a real application, this would make an API call to Google Analytics Data API
        try {
          // This is where you would fetch real GA data
          // For now, we'll set empty data until real GA integration is implemented
          setPageTrafficData([]);
          setTotalUsers(0);
          setError('No Google Analytics data available. Please connect your Google Analytics account.');
          setIsGaLoading(false);
        } catch (err) {
          console.error('Error processing Google Analytics data:', err);
          setError('Error processing Google Analytics data');
          setIsGaLoading(false);
        }
      } catch (err) {
        console.error('Error fetching Google Analytics data:', err);
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
    error
  };
};
