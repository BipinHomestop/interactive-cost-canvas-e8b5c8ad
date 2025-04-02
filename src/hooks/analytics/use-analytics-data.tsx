
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

// Import sub-hooks
import { useFetchAnalyticsData } from './hooks/use-fetch-analytics-data';
import { useDataProcessing } from './hooks/use-data-processing';
import { useCsvExport } from './hooks/use-csv-export';

export const useAnalyticsData = (timeRange: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalVisitors: 0,
    completeSubmissions: 0,
    partialSubmissions: 0,
    conversionRate: 0,
    avgTimeOnSite: 0,
    mostPopularStep: '',
    completionRate: 0,
    formSubmissions: 0
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

  // Process data using the sub-hook
  const { processAnalyticsData } = useDataProcessing({
    timeRange,
    setSummary,
    setDailyVisitorsData,
    setConversionFunnelData,
    setPopularPagesData,
    setPageVisitDetails,
    setHourlyActivityData,
    setMonthlyTrendData,
    setDetailedVisitData,
    setLocationData,
    setZipCodeData,
    setDetailedLocationData,
    setDetailedZipCodeData,
    setWeeklyHeatMapData
  });

  // Fetch data using the sub-hook
  const { fetchAnalyticsData } = useFetchAnalyticsData({
    timeRange,
    setIsLoading,
    processAnalyticsData
  });

  // Handle CSV export
  const { downloadCSV, downloadPageVisitCSV } = useCsvExport({
    detailedVisitData,
    pageVisitDetails,
    timeRange
  });

  const refetchData = useCallback(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

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
    downloadCSV,
    downloadPageVisitCSV,
    refetchData
  };
};
