
import { useState, useEffect } from 'react';
import { fetchSubmissionJourneyData } from './fetch-submission-data';
import { processStepCompletionData } from './process-step-completion';
import { SubmissionData, StepCompletionData, SubmissionJourneyResult } from './types';

export const useSubmissionJourneyData = (timeRange: string = '30d'): SubmissionJourneyResult => {
  const [journeyData, setJourneyData] = useState<SubmissionData>({
    submissions: []
  });
  const [stepCompletionData, setStepCompletionData] = useState<StepCompletionData[]>([]);
  const [isJourneyLoading, setIsJourneyLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmissionJourneyData = async () => {
      setIsJourneyLoading(true);
      
      const { submissions, error } = await fetchSubmissionJourneyData(timeRange);
      
      if (error) {
        setError(error);
      } else {
        // Set submissions data for display
        setJourneyData({ 
          submissions: submissions
        });
        
        // Process completion data for the table
        if (submissions && submissions.length > 0) {
          const completionData = processStepCompletionData(submissions);
          setStepCompletionData(completionData);
        } else {
          setStepCompletionData([]);
        }
        
        setError(null);
      }
      
      setIsJourneyLoading(false);
    };

    loadSubmissionJourneyData();
  }, [timeRange]);

  return { 
    journeyData,
    stepCompletionData,
    isJourneyLoading,
    error
  };
};
