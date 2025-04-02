
import { useCallback } from 'react';
import { 
  useSummaryProcessing,
  useVisitorProcessing,
  useConversionProcessing,
  useLocationProcessing
} from './data-processing';

type UseDataProcessingProps = {
  timeRange: string;
  setSummary: React.Dispatch<React.SetStateAction<{
    totalVisitors: number;
    completeSubmissions: number;
    partialSubmissions: number;
    conversionRate: number;
    avgTimeOnSite: number;
    mostPopularStep: string;
    completionRate: number;
    formSubmissions: number;
  }>>;
  setDailyVisitorsData: React.Dispatch<React.SetStateAction<any[]>>;
  setConversionFunnelData: React.Dispatch<React.SetStateAction<any[]>>;
  setPopularPagesData: React.Dispatch<React.SetStateAction<any[]>>;
  setPageVisitDetails: React.Dispatch<React.SetStateAction<any[]>>;
  setHourlyActivityData: React.Dispatch<React.SetStateAction<any[]>>;
  setMonthlyTrendData: React.Dispatch<React.SetStateAction<any[]>>;
  setDetailedVisitData: React.Dispatch<React.SetStateAction<any[]>>;
  setLocationData: React.Dispatch<React.SetStateAction<any[]>>;
  setZipCodeData: React.Dispatch<React.SetStateAction<any[]>>;
  setDetailedLocationData: React.Dispatch<React.SetStateAction<any[]>>;
  setDetailedZipCodeData: React.Dispatch<React.SetStateAction<any[]>>;
  setWeeklyHeatMapData: React.Dispatch<React.SetStateAction<any[]>>;
};

export const useDataProcessing = ({
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
}: UseDataProcessingProps) => {
  // Use individual processing hooks
  const { processSummaryData } = useSummaryProcessing({ timeRange, setSummary });
  
  const { 
    processVisitorData, 
    processVisitorDataFromSubmissions 
  } = useVisitorProcessing({
    timeRange,
    setDailyVisitorsData,
    setPopularPagesData,
    setPageVisitDetails,
    setHourlyActivityData,
    setWeeklyHeatMapData
  });
  
  const { processConversionData } = useConversionProcessing({
    timeRange,
    setConversionFunnelData,
    setMonthlyTrendData,
    setDetailedVisitData
  });
  
  const { processLocationDataHook } = useLocationProcessing({
    setLocationData,
    setZipCodeData,
    setDetailedLocationData,
    setDetailedZipCodeData
  });

  const processAnalyticsData = useCallback((visits: any[], submissions: any[]) => {
    const hasVisits = visits && visits.length > 0;
    const hasSubmissions = submissions && submissions.length > 0;
    
    // For debugging only
    console.log('Processing analytics data:', { 
      visits: hasVisits ? visits.length : 0, 
      visitsData: hasVisits ? visits.slice(0, 2) : [], 
      submissions: hasSubmissions ? submissions.length : 0,
      submissionsData: hasSubmissions ? submissions.slice(0, 2) : []
    });
    
    if (!hasVisits && !hasSubmissions) {
      console.log('No analytics data available for the selected period');
      resetDataStates();
      return;
    }

    // Process analytics data by categories
    processSummaryData(visits, submissions);
    
    if (hasVisits) {
      processVisitorData(visits);
      processConversionData(visits, submissions);
      processLocationDataHook(visits, submissions);
    } else if (hasSubmissions) {
      // Use submission data when no visit data is available
      processVisitorDataFromSubmissions(submissions);
      processConversionData([], submissions);
    }
  }, [
    processSummaryData, 
    processVisitorData, 
    processVisitorDataFromSubmissions,
    processConversionData, 
    processLocationDataHook
  ]);

  const resetDataStates = useCallback(() => {
    setSummary({
      totalVisitors: 0,
      completeSubmissions: 0,
      partialSubmissions: 0,
      conversionRate: 0,
      avgTimeOnSite: 0,
      mostPopularStep: 'No data',
      completionRate: 0,
      formSubmissions: 0
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
  }, [setSummary, setDailyVisitorsData, setConversionFunnelData, setPopularPagesData, 
     setPageVisitDetails, setHourlyActivityData, setMonthlyTrendData, setDetailedVisitData,
     setLocationData, setZipCodeData, setDetailedLocationData, setDetailedZipCodeData, setWeeklyHeatMapData]);

  return { processAnalyticsData, resetDataStates };
};
