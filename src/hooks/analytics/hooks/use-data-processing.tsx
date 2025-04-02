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
  countSubmissionsByStatus,
  processMonthlySubmissionData,
  processDetailedSubmissionData
} from '../utils/processors';

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

    const { complete, partial } = countSubmissionsByStatus(submissions);
    
    // Use actual visit data or fallback to submissions if no visitor data available
    const totalVisitors = hasVisits ? visits.length : Math.max(complete + partial, 0);
    const conversionRate = totalVisitors > 0 ? (complete / totalVisitors) * 100 : 0;
    const totalSubmissions = complete + partial;
    
    const avgTimeOnSite = hasVisits ? calculateAverageTimeOnSite(visits, timeRange) : 0;
    
    // Determine popular pages from visits or fallback
    let mostPopularStep = 'No data';
    if (hasVisits) {
      mostPopularStep = determineMostPopularPage(visits);
    } else if (hasSubmissions) {
      mostPopularStep = 'Contact Information'; // Fallback to most common submission step
    }
    
    setSummary({
      totalVisitors,
      completeSubmissions: complete,
      partialSubmissions: partial,
      conversionRate: parseFloat(conversionRate.toFixed(1)),
      avgTimeOnSite,
      mostPopularStep,
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
      // Fallback data when no visits but we have submissions
      const emptyVisitorData = hasSubmissions ? 
        submissions.map(sub => ({
          visit_date: sub.created_at ? sub.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          visit_time: sub.created_at ? sub.created_at.split('T')[1].substring(0, 8) : new Date().toTimeString().split(' ')[0],
          city: sub.city || 'Unknown',
          region: sub.state || 'Unknown',
          country: 'United States',
          page_visited: 'contact'
        })) : [];
      
      if (hasSubmissions && emptyVisitorData.length > 0) {
        // Use submission data to generate visitor data
        setDailyVisitorsData(processDailyVisitorsData(emptyVisitorData, timeRange));
        setPopularPagesData([{ name: 'Contact Information', visits: submissions.length }]);
        setPageVisitDetails([{
          page: 'Contact Information',
          visits: submissions.length,
          percentage: '100%',
          avgTimeOnPage: '2:30',
          firstVisit: emptyVisitorData[0].visit_date,
          lastVisit: emptyVisitorData[emptyVisitorData.length - 1].visit_date
        }]);
        setHourlyActivityData(processHourlyActivityData(emptyVisitorData));
        setWeeklyHeatMapData(processWeeklyHeatMapData(emptyVisitorData));
      } else {
        // No data at all
        setDailyVisitorsData([]);
        setPopularPagesData([{ name: 'No visit data available', visits: 0 }]);
        setPageVisitDetails([]);
        setHourlyActivityData([]);
        setWeeklyHeatMapData([]);
      }
      
      setConversionFunnelData([
        { name: 'Visitors', value: totalVisitors },
        { name: 'Started Quote', value: partial + complete },
        { name: 'Completed Form', value: complete },
        { name: 'Submissions', value: totalSubmissions }
      ]);
      
      if (hasSubmissions) {
        const monthlyData = processMonthlySubmissionData(submissions, timeRange);
        setMonthlyTrendData(monthlyData);
        setDetailedVisitData(processDetailedSubmissionData(submissions, timeRange));
      } else {
        setMonthlyTrendData([]);
        setDetailedVisitData([]);
      }
      
      setLocationData([]);
      setZipCodeData([]);
      setDetailedLocationData([]);
      setDetailedZipCodeData([]);
    }
  }, [timeRange, setSummary, setDailyVisitorsData, setConversionFunnelData, setPopularPagesData, 
      setPageVisitDetails, setHourlyActivityData, setMonthlyTrendData, setDetailedVisitData,
      setLocationData, setZipCodeData, setDetailedLocationData, setDetailedZipCodeData, setWeeklyHeatMapData]);

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
