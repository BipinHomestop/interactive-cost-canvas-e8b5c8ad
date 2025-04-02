
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { getStartDateFromRange, getEndDateFromRange } from '../analytics/utils/date-utils';

type PageTrafficData = {
  pagePath: string;
  pageViews: number;
  uniqueViews: number;
  avgTimeOnPage: string;
  bounceRate: number;
};

export const useGoogleAnalyticsData = (timeRange: string) => {
  const [isGaLoading, setIsGaLoading] = useState<boolean>(true);
  const [pageTrafficData, setPageTrafficData] = useState<PageTrafficData[]>([]);

  const fetchGoogleAnalyticsData = useCallback(async () => {
    try {
      setIsGaLoading(true);
      console.log('Fetching Google Analytics data for time range:', timeRange);
      
      // If GA is not loaded, create sample data
      if (typeof window === 'undefined' || !window.gtag) {
        console.log('Google Analytics not available, using sample data');
        
        // Sample data for demonstration
        const sampleData: PageTrafficData[] = [
          { 
            pagePath: '/', 
            pageViews: 124, 
            uniqueViews: 98, 
            avgTimeOnPage: '1:45', 
            bounceRate: 32.5 
          },
          { 
            pagePath: '/step/2', 
            pageViews: 87, 
            uniqueViews: 76, 
            avgTimeOnPage: '2:12', 
            bounceRate: 18.2 
          },
          { 
            pagePath: '/step/3', 
            pageViews: 65, 
            uniqueViews: 58, 
            avgTimeOnPage: '1:48', 
            bounceRate: 22.7 
          },
          { 
            pagePath: '/step/4', 
            pageViews: 42, 
            uniqueViews: 38, 
            avgTimeOnPage: '3:05', 
            bounceRate: 16.4 
          },
          { 
            pagePath: '/success', 
            pageViews: 26, 
            uniqueViews: 26, 
            avgTimeOnPage: '0:58', 
            bounceRate: 85.2 
          },
        ];
        
        setTimeout(() => {
          setPageTrafficData(sampleData);
          setIsGaLoading(false);
        }, 1000);
        return;
      }
      
      // In a real implementation, you would fetch GA data here using the GA API
      // For now, we're just using sample data
      
      const mockData: PageTrafficData[] = [
        { 
          pagePath: '/', 
          pageViews: 124, 
          uniqueViews: 98, 
          avgTimeOnPage: '1:45', 
          bounceRate: 32.5 
        },
        { 
          pagePath: '/step/2', 
          pageViews: 87, 
          uniqueViews: 76, 
          avgTimeOnPage: '2:12', 
          bounceRate: 18.2 
        },
        { 
          pagePath: '/step/3', 
          pageViews: 65, 
          uniqueViews: 58, 
          avgTimeOnPage: '1:48', 
          bounceRate: 22.7 
        },
        { 
          pagePath: '/step/4', 
          pageViews: 42, 
          uniqueViews: 38, 
          avgTimeOnPage: '3:05', 
          bounceRate: 16.4 
        },
        { 
          pagePath: '/success', 
          pageViews: 26, 
          uniqueViews: 26, 
          avgTimeOnPage: '0:58', 
          bounceRate: 85.2 
        },
      ];
      
      setPageTrafficData(mockData);
    } catch (error) {
      console.error('Error fetching Google Analytics data:', error);
      toast.error('Failed to load Google Analytics data');
    } finally {
      setIsGaLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchGoogleAnalyticsData();
  }, [fetchGoogleAnalyticsData]);

  return {
    isGaLoading,
    pageTrafficData,
    fetchGoogleAnalyticsData
  };
};
