
import React from 'react';
import { useUserLocation } from '@/hooks/analytics/use-user-location';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { ChartSection } from './dashboard/ChartSection';
import { DataTablesSection } from './dashboard/DataTablesSection';
import { VisitorInsights } from './dashboard/VisitorInsights';

interface AnalyticsDashboardProps {
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
    formSubmissions: number;
  };
  dailyVisitorsData: any[];
  conversionFunnelData: any[];
  popularPagesData: any[];
  pageVisitDetails: any[];
  hourlyActivityData: any[];
  monthlyTrendData: any[];
  detailedVisitData: any[];
  locationData: any[];
  detailedLocationData: any[];
  detailedZipCodeData: any[];
  weeklyHeatMapData: any[];
  downloadPageVisitCSV: () => void;
  hasVisitorData: boolean;
  topLocation: string;
  topZipCode: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  isLoading,
  timeRange,
  summary,
  dailyVisitorsData,
  conversionFunnelData,
  popularPagesData,
  pageVisitDetails,
  hourlyActivityData,
  monthlyTrendData,
  detailedVisitData,
  locationData,
  detailedLocationData,
  detailedZipCodeData,
  weeklyHeatMapData,
  downloadPageVisitCSV,
  hasVisitorData,
  topLocation,
  topZipCode
}) => {
  const { userLocationData } = useUserLocation();

  return (
    <>
      <DashboardHeader 
        isLoading={isLoading}
        timeRange={timeRange}
        summary={summary}
        topLocation={topLocation}
        topZipCode={topZipCode}
      />

      <VisitorInsights 
        hasVisitorData={hasVisitorData}
        pageVisitDetails={pageVisitDetails}
        weeklyHeatMapData={weeklyHeatMapData}
        userLocationData={userLocationData}
        isLoading={isLoading}
        downloadPageVisitCSV={downloadPageVisitCSV}
      />

      <ChartSection 
        dailyVisitorsData={dailyVisitorsData}
        conversionFunnelData={conversionFunnelData}
        popularPagesData={popularPagesData}
        monthlyTrendData={monthlyTrendData}
        hourlyActivityData={hourlyActivityData}
        isLoading={isLoading}
        hasVisitorData={hasVisitorData}
      />

      <DataTablesSection 
        hasVisitorData={hasVisitorData}
        summary={summary}
        detailedVisitData={detailedVisitData}
        detailedLocationData={detailedLocationData}
        detailedZipCodeData={detailedZipCodeData}
        isLoading={isLoading}
      />
    </>
  );
};
