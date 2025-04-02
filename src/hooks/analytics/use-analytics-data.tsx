import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import utility functions
import { getStartDateFromRange, getEndDateFromRange, calculateAverageTimeOnSite } from './utils/date-utils';
import { downloadDetailedVisitCSV, downloadPageVisitCSV } from './utils/csv-export';
import { processLocationData } from './utils/location-utils';
import { 
  determineMostPopularPage,
  calculateCompletionRate,
  processDailyVisitorsData,
  processConversionFunnelData,
  processPopularPagesData,
  processPageVisitDetails,
  processHourlyActivityData,
  processMonthlyTrendData,
  processDetailedVisitData,
  processWeeklyHeatMapData,
  countSubmissionsByStatus
} from './utils/data-processors';

export const useAnalyticsData = (timeRange: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalVisitors: 0,
    completeSubmissions: 0,
    partialSubmissions: 0,
    conversionRate: 0,
    avgTimeOnSite: 0,
    mostPopularStep: '',
    completionRate: 0
  });
  
  const [dailyVisitorsData, setDailyVisitorsData] = useState([]);
  const [conversionFunnelData, setConversionFunnelData] = useState([]);
  const [popularPagesData, setPopularPagesData] = useState([]);
  const [pageVisitDetails, setPageVisitDetails] = useState([]);
  const [hourlyActivityData, setHourlyActivityData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [detailedVisitData, setDetailedVisitData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [zipCodeData, setZipCodeData] = useState([]);
  const [detailedLocationData, setDetailedLocationData] = useState([]);
  const [detailedZipCodeData, setDetailedZipCodeData] = useState([]);
  const [weeklyHeatMapData, setWeeklyHeatMapData] = useState([]);

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
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const processAnalyticsData = (visits: any[], submissions: any[]) => {
    const hasVisits = visits && visits.length > 0;
    const hasSubmissions = submissions && submissions.length > 0;
    
    if (!hasVisits && !hasSubmissions) {
      console.log('No analytics data available for the selected period');
      toast.warning('No analytics data available for the selected period');
      resetDataStates();
      return;
    }

    console.log('Processing analytics data:', { visits: visits.length, submissions: submissions.length });

    const { complete, partial } = countSubmissionsByStatus(submissions);
    
    const totalVisitors = hasVisits ? visits.length : 0;
    const conversionRate = totalVisitors > 0 ? (complete / totalVisitors) * 100 : 0;
    
    const avgTimeOnSite = hasVisits ? calculateAverageTimeOnSite(visits, timeRange) : 0;
    
    setSummary({
      totalVisitors,
      completeSubmissions: complete,
      partialSubmissions: partial,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      avgTimeOnSite,
      mostPopularStep: hasVisits ? determineMostPopularPage(visits) : 'No data',
      completionRate: hasVisits && hasSubmissions ? calculateCompletionRate(submissions, visits) : 0
    });

    if (hasVisits) {
      setDailyVisitorsData(processDailyVisitorsData(visits, timeRange));
      setPopularPagesData(processPopularPagesData(visits));
      setPageVisitDetails(processPageVisitDetails(visits));
      setHourlyActivityData(processHourlyActivityData(visits));
      setWeeklyHeatMapData(processWeeklyHeatMapData(visits));
      
      setConversionFunnelData(processConversionFunnelData(visits, submissions));
      setMonthlyTrendData(processMonthlyTrendData(visits, submissions, timeRange));
      setDetailedVisitData(processDetailedVisitData(visits, submissions, timeRange));
      
      processLocationData(
        visits, 
        submissions, 
        setLocationData, 
        setZipCodeData, 
        setDetailedLocationData, 
        setDetailedZipCodeData
      );
    } else {
      setDailyVisitorsData([]);
      setPopularPagesData([{ name: 'No visit data available', visits: 0 }]);
      setPageVisitDetails([]);
      setHourlyActivityData([]);
      setWeeklyHeatMapData([]);
      setConversionFunnelData([
        { name: 'Visitors', value: 0 },
        { name: 'Started Quote', value: 0 },
        { name: 'Completed Form', value: 0 },
        { name: 'Submissions', value: totalSubmissions }
      ]);
      
      if (hasSubmissions) {
        const monthlyData = processMonthlySubmissionData(submissions, timeRange);
        setMonthlyTrendData(monthlyData);
      } else {
        setMonthlyTrendData([]);
      }
      
      setLocationData([]);
      setZipCodeData([]);
      setDetailedLocationData([]);
      setDetailedZipCodeData([]);
    }
  };

  const processMonthlySubmissionData = (submissions: any[], timeRange: string) => {
    const today = new Date();
    const startDate = getStartDateFromRange(timeRange);
    const months = timeRange === '7d' ? 3 : timeRange === '30d' ? 6 : 12;
    
    const monthlyData = [];
    for (let i = 0; i < months; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthSubmissions = submissions.filter(s => {
        if (!s.created_at) return false;
        return s.created_at.startsWith(yearMonth);
      });
      
      monthlyData.unshift({
        month: monthStr,
        visitors: 0,
        submissions: monthSubmissions.length
      });
    }
    
    return monthlyData;
  };

  const resetDataStates = () => {
    setSummary({
      totalVisitors: 0,
      completeSubmissions: 0,
      partialSubmissions: 0,
      conversionRate: 0,
      avgTimeOnSite: 0,
      mostPopularStep: 'No data',
      completionRate: 0
    });
    
    setDailyVisitorsData([]);
    setConversionFunnelData([]);
    setPopularPagesData([]);
    setPageVisitDetails([]);
    setHourlyActivityData([]);
    setMonthlyTrendData([]);
    setDetailedVisitData([]);
    setLocationData([]);
    setZipCodeData([]);
    setDetailedLocationData([]);
    setDetailedZipCodeData([]);
    setWeeklyHeatMapData([]);
  };

  const handleDownloadCSV = () => {
    downloadDetailedVisitCSV(detailedVisitData, timeRange);
  };
  
  const handleDownloadPageVisitCSV = () => {
    downloadPageVisitCSV(pageVisitDetails, timeRange);
  };

  return {
    isLoading,
    summary,
    dailyVisitorsData,
    conversionFunnelData,
    popularPagesData,
    pageVisitDetails,
    hourlyActivityData,
    monthlyTrendData,
    detailedVisitData,
    locationData,
    detailedLocationData,
    detailedZipCodeData,
    weeklyHeatMapData,
    downloadCSV: handleDownloadCSV,
    downloadPageVisitCSV: handleDownloadPageVisitCSV,
    refetchData: fetchAnalyticsData
  };
};
