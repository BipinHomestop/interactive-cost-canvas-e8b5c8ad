
import { useCallback } from 'react';
import { calculateAverageTimeOnSite } from '../../utils/date-utils';
import { 
  determineMostPopularPage,
  calculateCompletionRate,
  countSubmissionsByStatus
} from '../../utils/processors';

type UseSummaryProcessingProps = {
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
};

export const useSummaryProcessing = ({
  timeRange,
  setSummary
}: UseSummaryProcessingProps) => {
  const processSummaryData = useCallback((visits: any[], submissions: any[]) => {
    const hasVisits = visits && visits.length > 0;
    const hasSubmissions = submissions && submissions.length > 0;
    
    if (!hasVisits && !hasSubmissions) {
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
  }, [timeRange, setSummary]);

  return { processSummaryData };
};
