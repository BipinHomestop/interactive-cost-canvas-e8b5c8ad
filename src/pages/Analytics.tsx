
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
import { RealtimeVisitorsCard } from '@/components/analytics/RealtimeVisitorsCard';
import { 
  DailyVisitorsChart, 
  ConversionFunnelChart, 
  PopularPagesChart, 
  MonthlyPerformanceChart,
  HourlyActivityChart
} from '@/components/analytics/AnalyticsCharts';
import { 
  PageVisitTable, 
  DailyPerformanceTable,
  LocationPerformanceTable,
  ZipCodePerformanceTable
} from '@/components/analytics/AnalyticsTables';
import { UserLocationCard } from '@/components/analytics/UserLocationCard';
import { WeeklyHeatMapChart } from '@/components/analytics/WeeklyHeatMapChart';
import { useAnalyticsData } from '@/hooks/analytics/use-analytics-data';
import { useUserLocation } from '@/hooks/analytics/use-user-location';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  
  const { 
    isLoading,
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
    downloadCSV,
    downloadPageVisitCSV,
    refetchData
  } = useAnalyticsData(timeRange);
  
  const { userLocationData, trackPageView } = useUserLocation(timeRange);

  useEffect(() => {
    // Track analytics page view specifically for the analytics dashboard
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_analytics_dashboard', {
        time_range: timeRange
      });
    }
    
    // Log an analytics visit for this page
    const logAnalyticsVisit = async () => {
      // The visit is already logged by useUserLocation hook
      // Just refetch data after a short delay
      setTimeout(() => {
        refetchData();
        toast.success('Analytics data refreshed', {
          position: 'bottom-right',
          duration: 2000,
        });
      }, 1000);
    };
    
    logAnalyticsVisit();
  }, [timeRange]);

  // Get top location and zip code for summary cards
  const topLocation = locationData.length > 0 ? locationData[0].name : "No data";
  const topZipCode = detailedZipCodeData.length > 0 ? detailedZipCodeData[0].zipcode : "No data";
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Analytics Dashboard | American Concrete Coatings</title>
        <meta name="description" content="View analytics and performance metrics for your garage floor coating calculator." />
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/analytics" />
      </Helmet>

      <AnalyticsHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        downloadCSV={downloadCSV}
      />

      <div className="flex-1 container mx-auto py-8 px-4">
        {/* Realtime Visitors Card (New) */}
        <RealtimeVisitorsCard />
        
        <AnalyticsSummaryCards 
          totalVisitors={summary.totalVisitors}
          formSubmissions={summary.formSubmissions}
          conversionRate={summary.conversionRate}
          avgTimeOnSite={summary.avgTimeOnSite}
          mostPopularStep={summary.mostPopularStep}
          completionRate={summary.completionRate}
          topLocation={topLocation}
          topZipCode={topZipCode}
          isLoading={isLoading}
        />
        
        <WeeklyHeatMapChart 
          data={weeklyHeatMapData || []} 
          isLoading={isLoading} 
        />
        
        <PageVisitTable
          pageVisitDetails={pageVisitDetails}
          isLoading={isLoading}
          downloadPageVisitCSV={downloadPageVisitCSV}
        />

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

        <HourlyActivityChart 
          data={hourlyActivityData} 
          isLoading={isLoading} 
        />

        <DailyPerformanceTable 
          data={detailedVisitData} 
          isLoading={isLoading} 
        />

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

        <UserLocationCard 
          userLocationData={userLocationData} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
