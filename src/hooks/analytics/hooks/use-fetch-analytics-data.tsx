
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getStartDateFromRange, getEndDateFromRange } from '../utils/date-utils';

type UseFetchAnalyticsDataProps = {
  timeRange: string;
  setIsLoading: (loading: boolean) => void;
  processAnalyticsData: (visits: any[], submissions: any[]) => void;
};

export const useFetchAnalyticsData = ({
  timeRange,
  setIsLoading,
  processAnalyticsData
}: UseFetchAnalyticsDataProps) => {
  const fetchAnalyticsData = useCallback(async () => {
    try {
      console.log('Fetching analytics data for time range:', timeRange);
      setIsLoading(true);
      
      const startDate = getStartDateFromRange(timeRange);
      const endDate = getEndDateFromRange(timeRange);
      
      const startDateString = startDate.toISOString().split('T')[0];
      const endDateString = endDate.toISOString().split('T')[0];
      
      console.log(`Date range for query: ${startDateString} to ${endDateString}`);
      
      let query = supabase
        .from('analytics_location_visits')
        .select('*')
        .gte('visit_date', startDateString);
      
      if (timeRange.includes(':')) {
        query = query.lte('visit_date', endDateString);
      }
      
      const { data: locationVisits, error: locationError } = await query;
      
      if (locationError) {
        console.error('Error fetching location data:', locationError);
        toast.error('Failed to load location data');
        return;
      }

      console.log('Retrieved location visits:', locationVisits?.length || 0);

      let submissionsQuery = supabase
        .from('cost_calculator_submissions')
        .select('*')
        .gte('created_at', startDate.toISOString());
      
      if (timeRange.includes(':')) {
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        submissionsQuery = submissionsQuery.lt('created_at', nextDay.toISOString());
      }
      
      const { data: submissions, error: submissionsError } = await submissionsQuery;

      if (submissionsError) {
        console.error('Error fetching submissions data:', submissionsError);
        toast.error('Failed to load submissions data');
      }

      console.log('Retrieved submissions:', submissions?.length || 0);
      
      processAnalyticsData(locationVisits || [], submissions || []);
      
    } catch (err) {
      console.error('Error in fetchAnalyticsData:', err);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange, setIsLoading, processAnalyticsData]);

  return { fetchAnalyticsData };
};
