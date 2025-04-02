
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
          console.log('Google Analytics not available, using mock data');
          
          // If Google Analytics is not available, provide mock data
          const mockData = getMockGoogleAnalyticsData(timeRange);
          setPageTrafficData(mockData);
          
          // Calculate total users from mock data
          const totalMockUsers = mockData.reduce((sum, page) => sum + page.uniqueViews, 0);
          setTotalUsers(Math.round(totalMockUsers * 0.7)); // Estimate unique users across pages
          
          setIsGaLoading(false);
          return;
        }

        // In a real application, you would make an API call to Google Analytics Data API
        // Here we're simulating a call to GA with a timeout and mock data
        setTimeout(() => {
          try {
            // Here you would normally fetch real data
            const mockData = getMockGoogleAnalyticsData(timeRange);
            setPageTrafficData(mockData);

            // Calculate total users
            const totalGaUsers = timeRange === '7d' ? 387 : 
                               timeRange === '30d' ? 1204 : 3527;
            setTotalUsers(totalGaUsers);
            
            setIsGaLoading(false);
          } catch (err) {
            console.error('Error processing Google Analytics data:', err);
            setError('Error processing Google Analytics data');
            setIsGaLoading(false);
          }
        }, 1500);
        
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

// Generate mock data based on time range
const getMockGoogleAnalyticsData = (timeRange: string): GoogleAnalyticsPageData[] => {
  // Multiplier based on time range
  const multiplier = timeRange === '7d' ? 1 : 
                    timeRange === '30d' ? 4 : 12;
  
  return [
    {
      pagePath: '/',
      pageViews: 523 * multiplier,
      uniqueViews: 387 * multiplier,
      avgTimeOnPage: '1:45',
      bounceRate: 43.2
    },
    {
      pagePath: '/step/1',
      pageViews: 412 * multiplier,
      uniqueViews: 289 * multiplier,
      avgTimeOnPage: '2:12',
      bounceRate: 29.8
    },
    {
      pagePath: '/step/2',
      pageViews: 298 * multiplier,
      uniqueViews: 187 * multiplier,
      avgTimeOnPage: '3:04',
      bounceRate: 18.7
    },
    {
      pagePath: '/step/3',
      pageViews: 214 * multiplier,
      uniqueViews: 152 * multiplier,
      avgTimeOnPage: '2:37',
      bounceRate: 24.1
    },
    {
      pagePath: '/success',
      pageViews: 97 * multiplier,
      uniqueViews: 92 * multiplier,
      avgTimeOnPage: '1:08',
      bounceRate: 72.5
    },
    {
      pagePath: '/analytics',
      pageViews: 45 * multiplier,
      uniqueViews: 12 * multiplier,
      avgTimeOnPage: '5:42',
      bounceRate: 8.3
    }
  ];
};
