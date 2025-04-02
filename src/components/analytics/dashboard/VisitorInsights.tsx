
import React from 'react';
import { WeeklyHeatMapChart } from '@/components/analytics/WeeklyHeatMapChart';
import { PageVisitTable } from '@/components/analytics/AnalyticsTables';
import { UserLocationCard } from '@/components/analytics/UserLocationCard';

interface VisitorInsightsProps {
  hasVisitorData: boolean;
  pageVisitDetails: any[];
  weeklyHeatMapData: any[];
  userLocationData: any;
  isLoading: boolean;
  downloadPageVisitCSV: () => void;
}

export const VisitorInsights: React.FC<VisitorInsightsProps> = ({
  hasVisitorData,
  pageVisitDetails,
  weeklyHeatMapData,
  userLocationData,
  isLoading,
  downloadPageVisitCSV
}) => {
  return (
    <>
      {hasVisitorData && (
        <WeeklyHeatMapChart 
          data={weeklyHeatMapData || []} 
          isLoading={isLoading} 
        />
      )}
      
      {hasVisitorData && (
        <PageVisitTable
          pageVisitDetails={pageVisitDetails}
          isLoading={isLoading}
          downloadPageVisitCSV={downloadPageVisitCSV}
        />
      )}

      <UserLocationCard 
        userLocationData={userLocationData} 
        isLoading={isLoading} 
      />
    </>
  );
};
