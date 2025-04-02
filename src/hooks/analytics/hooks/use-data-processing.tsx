
import { useCallback } from 'react';
import { calculateAverageTimeOnSite } from '../utils/date-utils';
import { processLocationData } from '../utils/location-utils';
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
} from '../utils/data-processors';

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
  const processAnalyticsData = useCallback((visits: any[], submissions: any[]) => {
    const hasVisits = visits && visits.length > 0;
    const hasSubmissions = submissions && submissions.length > 0;
    
    if (!hasVisits && !hasSubmissions) {
      console.log('No analytics data available for the selected period');
      resetDataStates();
      return;
    }

    console.log('Processing analytics data:', { visits: visits.length, submissions: submissions.length });

    const { complete, partial } = countSubmissionsByStatus(submissions);
    
    const totalVisitors = hasVisits ? visits.length : 0;
    const conversionRate = totalVisitors > 0 ? (complete / totalVisitors) * 100 : 0;
    const totalSubmissions = complete + partial;
    
    const avgTimeOnSite = hasVisits ? calculateAverageTimeOnSite(visits, timeRange) : 0;
    
    setSummary({
      totalVisitors,
      completeSubmissions: complete,
      partialSubmissions: partial,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      avgTimeOnSite,
      mostPopularStep: hasVisits ? determineMostPopularPage(visits) : 'No data',
      completionRate: hasVisits && hasSubmissions ? calculateCompletionRate(submissions, visits) : 0,
      formSubmissions: totalSubmissions
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
  }, [timeRange, setSummary, setDailyVisitorsData, setConversionFunnelData, setPopularPagesData, 
      setPageVisitDetails, setHourlyActivityData, setMonthlyTrendData, setDetailedVisitData,
      setLocationData, setZipCodeData, setDetailedLocationData, setDetailedZipCodeData, setWeeklyHeatMapData]);

  const processMonthlySubmissionData = (submissions: any[], timeRange: string) => {
    const today = new Date();
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
