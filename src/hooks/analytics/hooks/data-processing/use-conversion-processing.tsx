
import { useCallback } from 'react';
import { 
  processConversionFunnelData,
  processMonthlyTrendData,
  processDetailedVisitData,
  processMonthlySubmissionData,
  processDetailedSubmissionData
} from '../../utils/processors';

type UseConversionProcessingProps = {
  timeRange: string;
  setConversionFunnelData: React.Dispatch<React.SetStateAction<any[]>>;
  setMonthlyTrendData: React.Dispatch<React.SetStateAction<any[]>>;
  setDetailedVisitData: React.Dispatch<React.SetStateAction<any[]>>;
};

export const useConversionProcessing = ({
  timeRange,
  setConversionFunnelData,
  setMonthlyTrendData,
  setDetailedVisitData
}: UseConversionProcessingProps) => {
  const processConversionData = useCallback((visits: any[], submissions: any[]) => {
    const hasVisits = visits && visits.length > 0;
    const hasSubmissions = submissions && submissions.length > 0;
    
    if (!hasVisits && !hasSubmissions) {
      setConversionFunnelData([]);
      setMonthlyTrendData([]);
      setDetailedVisitData([]);
      return;
    }

    if (hasVisits) {
      setConversionFunnelData(processConversionFunnelData(visits, submissions));
      setMonthlyTrendData(processMonthlyTrendData(visits, submissions, timeRange));
      setDetailedVisitData(processDetailedVisitData(visits, submissions, timeRange));
    } else if (hasSubmissions) {
      // Use submission data to generate conversion data when no visit data is available
      const totalVisitors = submissions.length;
      const partial = submissions.filter(sub => 
        sub.payment_status !== 'completed' && 
        sub.payment_status !== 'paid' &&
        sub.name && sub.email && sub.phone
      ).length;
      
      const complete = submissions.filter(sub => 
        sub.payment_status === 'completed' || sub.payment_status === 'paid'
      ).length;
      
      setConversionFunnelData([
        { name: 'Visitors', value: totalVisitors },
        { name: 'Started Quote', value: partial + complete },
        { name: 'Completed Form', value: complete },
        { name: 'Submissions', value: partial + complete }
      ]);
      
      setMonthlyTrendData(processMonthlySubmissionData(submissions, timeRange));
      setDetailedVisitData(processDetailedSubmissionData(submissions, timeRange));
    }
  }, [timeRange, setConversionFunnelData, setMonthlyTrendData, setDetailedVisitData]);

  return { processConversionData };
};
