
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
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchGoogleAnalyticsData = useCallback(async () => {
    try {
      setIsGaLoading(true);
      console.log('Fetching Google Analytics data for time range:', timeRange);
      
      // If GA is not loaded, create sample data with varying data based on time range
      if (typeof window === 'undefined' || !window.gtag) {
        console.log('Google Analytics not available, using sample data');
        
        // Create different sample data based on time range
        let totalUsersCount = 0;
        let sampleData: PageTrafficData[] = [];
        
        if (timeRange === '7d') {
          totalUsersCount = 256;
          sampleData = [
            { pagePath: '/', pageViews: 124, uniqueViews: 98, avgTimeOnPage: '1:45', bounceRate: 32.5 },
            { pagePath: '/step/2', pageViews: 87, uniqueViews: 76, avgTimeOnPage: '2:12', bounceRate: 18.2 },
            { pagePath: '/step/3', pageViews: 65, uniqueViews: 58, avgTimeOnPage: '1:48', bounceRate: 22.7 },
            { pagePath: '/step/4', pageViews: 42, uniqueViews: 38, avgTimeOnPage: '3:05', bounceRate: 16.4 },
            { pagePath: '/success', pageViews: 26, uniqueViews: 26, avgTimeOnPage: '0:58', bounceRate: 85.2 },
          ];
        } else if (timeRange === '30d') {
          totalUsersCount = 843;
          sampleData = [
            { pagePath: '/', pageViews: 472, uniqueViews: 387, avgTimeOnPage: '1:58', bounceRate: 28.4 },
            { pagePath: '/step/2', pageViews: 326, uniqueViews: 289, avgTimeOnPage: '2:23', bounceRate: 17.8 },
            { pagePath: '/step/3', pageViews: 245, uniqueViews: 215, avgTimeOnPage: '2:05', bounceRate: 19.3 },
            { pagePath: '/step/4', pageViews: 178, uniqueViews: 154, avgTimeOnPage: '2:48', bounceRate: 15.7 },
            { pagePath: '/success', pageViews: 112, uniqueViews: 112, avgTimeOnPage: '1:12', bounceRate: 82.6 },
            { pagePath: '/analytics', pageViews: 87, uniqueViews: 42, avgTimeOnPage: '4:35', bounceRate: 8.2 },
          ];
        } else {
          // 90d
          totalUsersCount = 2458;
          sampleData = [
            { pagePath: '/', pageViews: 1247, uniqueViews: 1056, avgTimeOnPage: '2:03', bounceRate: 25.8 },
            { pagePath: '/step/2', pageViews: 986, uniqueViews: 865, avgTimeOnPage: '2:32', bounceRate: 16.5 },
            { pagePath: '/step/3', pageViews: 768, uniqueViews: 682, avgTimeOnPage: '2:18', bounceRate: 18.7 },
            { pagePath: '/step/4', pageViews: 583, uniqueViews: 524, avgTimeOnPage: '2:53', bounceRate: 14.9 },
            { pagePath: '/success', pageViews: 398, uniqueViews: 398, avgTimeOnPage: '1:28', bounceRate: 79.3 },
            { pagePath: '/analytics', pageViews: 256, uniqueViews: 142, avgTimeOnPage: '5:12', bounceRate: 7.5 },
            { pagePath: '/faq', pageViews: 187, uniqueViews: 172, avgTimeOnPage: '3:47', bounceRate: 12.3 },
          ];
        }
        
        setTimeout(() => {
          setTotalUsers(totalUsersCount);
          setPageTrafficData(sampleData);
          setIsGaLoading(false);
        }, 1000);
        return;
      }
      
      // In a real implementation, you would fetch GA data here using the GA API
      // For now, we're just using the same sample data logic as above
      
      let totalUsersCount = 0;
      let mockData: PageTrafficData[] = [];
      
      if (timeRange === '7d') {
        totalUsersCount = 256;
        mockData = [
          { pagePath: '/', pageViews: 124, uniqueViews: 98, avgTimeOnPage: '1:45', bounceRate: 32.5 },
          { pagePath: '/step/2', pageViews: 87, uniqueViews: 76, avgTimeOnPage: '2:12', bounceRate: 18.2 },
          { pagePath: '/step/3', pageViews: 65, uniqueViews: 58, avgTimeOnPage: '1:48', bounceRate: 22.7 },
          { pagePath: '/step/4', pageViews: 42, uniqueViews: 38, avgTimeOnPage: '3:05', bounceRate: 16.4 },
          { pagePath: '/success', pageViews: 26, uniqueViews: 26, avgTimeOnPage: '0:58', bounceRate: 85.2 },
        ];
      } else if (timeRange === '30d') {
        totalUsersCount = 843;
        mockData = [
          { pagePath: '/', pageViews: 472, uniqueViews: 387, avgTimeOnPage: '1:58', bounceRate: 28.4 },
          { pagePath: '/step/2', pageViews: 326, uniqueViews: 289, avgTimeOnPage: '2:23', bounceRate: 17.8 },
          { pagePath: '/step/3', pageViews: 245, uniqueViews: 215, avgTimeOnPage: '2:05', bounceRate: 19.3 },
          { pagePath: '/step/4', pageViews: 178, uniqueViews: 154, avgTimeOnPage: '2:48', bounceRate: 15.7 },
          { pagePath: '/success', pageViews: 112, uniqueViews: 112, avgTimeOnPage: '1:12', bounceRate: 82.6 },
          { pagePath: '/analytics', pageViews: 87, uniqueViews: 42, avgTimeOnPage: '4:35', bounceRate: 8.2 },
        ];
      } else {
        // 90d
        totalUsersCount = 2458;
        mockData = [
          { pagePath: '/', pageViews: 1247, uniqueViews: 1056, avgTimeOnPage: '2:03', bounceRate: 25.8 },
          { pagePath: '/step/2', pageViews: 986, uniqueViews: 865, avgTimeOnPage: '2:32', bounceRate: 16.5 },
          { pagePath: '/step/3', pageViews: 768, uniqueViews: 682, avgTimeOnPage: '2:18', bounceRate: 18.7 },
          { pagePath: '/step/4', pageViews: 583, uniqueViews: 524, avgTimeOnPage: '2:53', bounceRate: 14.9 },
          { pagePath: '/success', pageViews: 398, uniqueViews: 398, avgTimeOnPage: '1:28', bounceRate: 79.3 },
          { pagePath: '/analytics', pageViews: 256, uniqueViews: 142, avgTimeOnPage: '5:12', bounceRate: 7.5 },
          { pagePath: '/faq', pageViews: 187, uniqueViews: 172, avgTimeOnPage: '3:47', bounceRate: 12.3 },
        ];
      }
      
      setTotalUsers(totalUsersCount);
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
    totalUsers,
    fetchGoogleAnalyticsData
  };
};
