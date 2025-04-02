
import React from 'react';
import { RealtimeVisitorsCard } from '@/components/analytics/RealtimeVisitorsCard';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { GoogleAnalyticsSection } from '@/components/analytics/GoogleAnalyticsSection';

interface DashboardHeaderProps {
  isLoading: boolean;
  timeRange: string;
  summary: {
    totalVisitors: number;
    completeSubmissions: number;
    partialSubmissions: number;
    conversionRate: number;
    avgTimeOnSite: number;
    mostPopularStep: string;
    completionRate: number;
  };
  topLocation: string;
  topZipCode: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isLoading,
  timeRange,
  summary,
  topLocation,
  topZipCode
}) => {
  return (
    <>
      <RealtimeVisitorsCard />
      
      <AnalyticsSummaryCards 
        totalVisitors={summary.totalVisitors}
        completeSubmissions={summary.completeSubmissions}
        partialSubmissions={summary.partialSubmissions}
        conversionRate={summary.conversionRate}
        avgTimeOnSite={summary.avgTimeOnSite}
        mostPopularStep={summary.mostPopularStep}
        completionRate={summary.completionRate}
        topLocation={topLocation}
        topZipCode={topZipCode}
        isLoading={isLoading}
      />
      
      <GoogleAnalyticsSection 
        isLoading={isLoading}
        timeRange={timeRange}
      />
    </>
  );
};
