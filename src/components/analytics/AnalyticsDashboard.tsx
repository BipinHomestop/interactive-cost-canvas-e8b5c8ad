
import React from 'react';
import { RealtimeVisitorsCard } from '@/components/analytics/RealtimeVisitorsCard';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { WeeklyHeatMapChart } from '@/components/analytics/WeeklyHeatMapChart';
import { UserLocationCard } from '@/components/analytics/UserLocationCard';
import { GoogleAnalyticsSection } from '@/components/analytics/GoogleAnalyticsSection';
import { 
  PageVisitTable, 
  DailyPerformanceTable,
  LocationPerformanceTable,
  ZipCodePerformanceTable
} from '@/components/analytics/AnalyticsTables';
import { 
  DailyVisitorsChart, 
  ConversionFunnelChart, 
  PopularPagesChart, 
  MonthlyPerformanceChart,
  HourlyActivityChart
} from '@/components/analytics/charts';
import { useUserLocation } from '@/hooks/analytics/use-user-location';

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
      
      {/* Add Google Analytics Section */}
      <GoogleAnalyticsSection 
        isLoading={isLoading}
        timeRange={timeRange}
      />
      
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

      <UserLocationCard 
        userLocationData={userLocationData} 
        isLoading={isLoading} 
      />
    </>
  );
};

const ChartSection: React.FC<{
  dailyVisitorsData: any[];
  conversionFunnelData: any[];
  popularPagesData: any[];
  monthlyTrendData: any[];
  hourlyActivityData: any[];
  isLoading: boolean;
  hasVisitorData: boolean;
}> = ({
  dailyVisitorsData,
  conversionFunnelData,
  popularPagesData,
  monthlyTrendData,
  hourlyActivityData,
  isLoading,
  hasVisitorData
}) => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <DailyVisitorsChart 
          data={dailyVisitorsData} 
          isLoading={isLoading} 
        />
        
        <ConversionFunnelChart 
          data={conversionFunnelData} 
          isLoading={isLoading} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PopularPagesChart 
          data={popularPagesData} 
          isLoading={isLoading} 
        />
        
        <MonthlyPerformanceChart 
          data={monthlyTrendData} 
          isLoading={isLoading} 
        />
      </div>

      {hasVisitorData && (
        <HourlyActivityChart 
          data={hourlyActivityData} 
          isLoading={isLoading} 
        />
      )}
    </>
  );
};

const DataTablesSection: React.FC<{
  hasVisitorData: boolean;
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
  detailedVisitData: any[];
  detailedLocationData: any[];
  detailedZipCodeData: any[];
  isLoading: boolean;
}> = ({
  hasVisitorData,
  summary,
  detailedVisitData,
  detailedLocationData,
  detailedZipCodeData,
  isLoading
}) => {
  return (
    <>
      {(hasVisitorData || summary.formSubmissions > 0) && (
        <DailyPerformanceTable 
          data={detailedVisitData} 
          isLoading={isLoading} 
        />
      )}

      {hasVisitorData && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LocationPerformanceTable 
            data={detailedLocationData} 
            isLoading={isLoading}
            title="Location Performance"
            description="Performance metrics by city"
          />
          
          <ZipCodePerformanceTable 
            data={detailedZipCodeData} 
            isLoading={isLoading} 
          />
        </div>
      )}
    </>
  );
};
