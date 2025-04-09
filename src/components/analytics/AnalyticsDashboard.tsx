
import React from 'react';
import { useUserLocation } from '@/hooks/analytics/use-user-location';
import { SubmissionJourneySection } from './SubmissionJourneySection';
import { PageVisitTable } from './AnalyticsTables';

interface AnalyticsDashboardProps {
  isLoading: boolean;
  timeRange: string;
  pageVisitDetails: any[];
  downloadPageVisitCSV: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  isLoading,
  timeRange,
  pageVisitDetails,
  downloadPageVisitCSV
}) => {
  return (
    <>
      {/* User Submissions Data */}
      <SubmissionJourneySection
        isLoading={isLoading}
        timeRange={timeRange}
      />

      {/* Page Visit Details */}
      <PageVisitTable
        pageVisitDetails={pageVisitDetails}
        isLoading={isLoading}
        downloadPageVisitCSV={downloadPageVisitCSV}
      />
    </>
  );
};
