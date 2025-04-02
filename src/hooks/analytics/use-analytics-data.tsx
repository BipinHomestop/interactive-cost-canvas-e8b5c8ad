
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import utility functions
import { getStartDateFromRange, calculateAverageTimeOnSite } from './utils/date-utils';
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
  processWeeklyHeatMapData
} from './utils/data-processors';

export const useAnalyticsData = (timeRange: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalVisitors: 0,
    formSubmissions: 0,
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

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const startDate = getStartDateFromRange(timeRange);
      const startDateString = startDate.toISOString().split('T')[0];
      
      // Fetch location visits
      const { data: locationVisits, error: locationError } = await supabase
        .from('analytics_location_visits')
        .select('*')
        .gte('visit_date', startDateString);
      
      if (locationError) {
        console.error('Error fetching location data:', locationError);
        toast.error('Failed to load location data');
        return;
      }

      // Fetch form submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('cost_calculator_submissions')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (submissionsError) {
        console.error('Error fetching submissions data:', submissionsError);
        toast.error('Failed to load submissions data');
      }

      processAnalyticsData(locationVisits || [], submissions || []);
      
    } catch (err) {
      console.error('Error in fetchAnalyticsData:', err);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalyticsData = (visits: any[], submissions: any[]) => {
    if (!visits || visits.length === 0) {
      toast.warning('No analytics data available for the selected period');
      resetDataStates();
      return;
    }

    const totalVisitors = visits.length;
    const totalSubmissions = submissions.length;
    const conversionRate = totalVisitors > 0 ? (totalSubmissions / totalVisitors) * 100 : 0;
    
    // Calculate actual time on site from real data
    const avgTimeOnSite = calculateAverageTimeOnSite(visits, timeRange);
    
    setSummary({
      totalVisitors,
      formSubmissions: totalSubmissions,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      avgTimeOnSite,
      mostPopularStep: determineMostPopularPage(visits),
      completionRate: calculateCompletionRate(submissions, visits)
    });

    setDailyVisitorsData(processDailyVisitorsData(visits, timeRange));
    setConversionFunnelData(processConversionFunnelData(visits, submissions));
    setPopularPagesData(processPopularPagesData(visits));
    setPageVisitDetails(processPageVisitDetails(visits));
    setHourlyActivityData(processHourlyActivityData(visits));
    setMonthlyTrendData(processMonthlyTrendData(visits, submissions, timeRange));
    setDetailedVisitData(processDetailedVisitData(visits, submissions, timeRange));
    setWeeklyHeatMapData(processWeeklyHeatMapData(visits));
    
    processLocationData(
      visits, 
      submissions, 
      setLocationData, 
      setZipCodeData, 
      setDetailedLocationData, 
      setDetailedZipCodeData
    );
  };

  const resetDataStates = () => {
    setSummary({
      totalVisitors: 0,
      formSubmissions: 0,
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
    downloadPageVisitCSV: handleDownloadPageVisitCSV
  };
};
