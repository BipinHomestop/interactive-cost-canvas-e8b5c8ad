
import { useCallback } from 'react';
import { 
  processDailyVisitorsData,
  processPopularPagesData,
  processPageVisitDetails,
  processHourlyActivityData,
  processWeeklyHeatMapData
} from '../../utils/processors';

type UseVisitorProcessingProps = {
  timeRange: string;
  setDailyVisitorsData: React.Dispatch<React.SetStateAction<any[]>>;
  setPopularPagesData: React.Dispatch<React.SetStateAction<any[]>>;
  setPageVisitDetails: React.Dispatch<React.SetStateAction<any[]>>;
  setHourlyActivityData: React.Dispatch<React.SetStateAction<any[]>>;
  setWeeklyHeatMapData: React.Dispatch<React.SetStateAction<any[]>>;
};

export const useVisitorProcessing = ({
  timeRange,
  setDailyVisitorsData,
  setPopularPagesData,
  setPageVisitDetails,
  setHourlyActivityData,
  setWeeklyHeatMapData
}: UseVisitorProcessingProps) => {
  const processVisitorData = useCallback((visits: any[]) => {
    const hasVisits = visits && visits.length > 0;
    
    if (!hasVisits) {
      setDailyVisitorsData([]);
      setPopularPagesData([{ name: 'No visit data available', visits: 0 }]);
      setPageVisitDetails([]);
      setHourlyActivityData([]);
      setWeeklyHeatMapData([]);
      return;
    }

    setDailyVisitorsData(processDailyVisitorsData(visits, timeRange));
    setPopularPagesData(processPopularPagesData(visits));
    setPageVisitDetails(processPageVisitDetails(visits));
    setHourlyActivityData(processHourlyActivityData(visits));
    setWeeklyHeatMapData(processWeeklyHeatMapData(visits));
  }, [timeRange, setDailyVisitorsData, setPopularPagesData, setPageVisitDetails, 
      setHourlyActivityData, setWeeklyHeatMapData]);
  
  const processVisitorDataFromSubmissions = useCallback((submissions: any[]) => {
    const hasSubmissions = submissions && submissions.length > 0;
    
    if (!hasSubmissions) {
      setDailyVisitorsData([]);
      setPopularPagesData([{ name: 'No visit data available', visits: 0 }]);
      setPageVisitDetails([]);
      setHourlyActivityData([]);
      setWeeklyHeatMapData([]);
      return;
    }
    
    // Create synthetic visitor data from submissions
    const emptyVisitorData = submissions.map(sub => ({
      visit_date: sub.created_at ? sub.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      visit_time: sub.created_at ? sub.created_at.split('T')[1].substring(0, 8) : new Date().toTimeString().split(' ')[0],
      city: sub.city || 'Unknown',
      region: sub.state || 'Unknown',
      country: 'United States',
      page_visited: 'contact'
    }));
    
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
  }, [timeRange, setDailyVisitorsData, setPopularPagesData, setPageVisitDetails, 
      setHourlyActivityData, setWeeklyHeatMapData]);

  return { processVisitorData, processVisitorDataFromSubmissions };
};
