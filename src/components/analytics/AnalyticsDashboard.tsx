
import React from 'react';
import { SubmissionJourneySection } from './submission-journey/SubmissionJourneySection';

interface AnalyticsDashboardProps {
  isLoading: boolean;
  timeRange: string;
  pageVisitDetails: any[];
  downloadPageVisitCSV: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  isLoading,
  timeRange,
}) => {
  return (
    <>
      {/* User Submissions Data */}
      <SubmissionJourneySection
        isLoading={isLoading}
        timeRange={timeRange}
      />
    </>
  );
};
