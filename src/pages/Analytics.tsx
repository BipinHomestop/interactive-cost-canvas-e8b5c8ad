
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
} from '@/components/analytics/charts';
import { 
  PageVisitTable, 
  DailyPerformanceTable,
  LocationPerformanceTable,
  ZipCodePerformanceTable
} from '@/components/analytics/AnalyticsTables';
import { DateRangeFilter } from '@/components/analytics/DateRangeFilter';
import { UserLocationCard } from '@/components/analytics/UserLocationCard';
import { WeeklyHeatMapChart } from '@/components/analytics/WeeklyHeatMapChart';
import { useAnalyticsData } from '@/hooks/analytics/use-analytics-data';
import { useUserLocation } from '@/hooks/analytics/use-user-location';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [customRangeString, setCustomRangeString] = useState<string | null>(null);
  
  const applyCustomRange = () => {
    if (customStartDate && customEndDate) {
      const startStr = format(customStartDate, 'yyyy-MM-dd');
      const endStr = format(customEndDate, 'yyyy-MM-dd');
      setCustomRangeString(`${startStr}:${endStr}`);
      toast.success('Custom date range applied');
    }
  };
  
  // Use the custom range or regular time range
  const effectiveTimeRange = customRangeString || timeRange;
  
  // Reset custom range when switching to standard ranges
  useEffect(() => {
    if (timeRange !== 'custom') {
      setCustomRangeString(null);
    }
  }, [timeRange]);
  
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
  } = useAnalyticsData(effectiveTimeRange);
  
  const { userLocationData, trackPageView } = useUserLocation(effectiveTimeRange);
  const hasVisitorData = summary.totalVisitors > 0;

  useEffect(() => {
    // Track analytics page view specifically for the analytics dashboard
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_analytics_dashboard', {
        time_range: effectiveTimeRange
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
  }, [effectiveTimeRange]);

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
        {/* Date Range Filter */}
        <DateRangeFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          applyCustomRange={applyCustomRange}
        />
        
        {/* Realtime Visitors Card */}
        <RealtimeVisitorsCard />
        
        {!hasVisitorData && (summary.completeSubmissions > 0 || summary.partialSubmissions > 0) && !isLoading && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limited Data Available</AlertTitle>
            <AlertDescription>
              We found {summary.completeSubmissions} complete and {summary.partialSubmissions} partial form submissions 
              but no visitor tracking data for the selected time period. 
              Some charts may appear empty or show limited information.
            </AlertDescription>
          </Alert>
        )}
        
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
        
        {/* Weekly Heatmap Chart */}
        {hasVisitorData && (
          <WeeklyHeatMapChart 
            data={weeklyHeatMapData || []} 
            isLoading={isLoading} 
          />
        )}
        
        {/* Only show page visits table if we have visitor data */}
        {hasVisitorData && (
          <PageVisitTable
            pageVisitDetails={pageVisitDetails}
            isLoading={isLoading}
            downloadPageVisitCSV={downloadPageVisitCSV}
          />
        )}

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

        {/* Only show hourly activity if we have visitor data */}
        {hasVisitorData && (
          <HourlyActivityChart 
            data={hourlyActivityData} 
            isLoading={isLoading} 
          />
        )}

        {/* Show daily performance if we have any data */}
        {(hasVisitorData || summary.formSubmissions > 0) && (
          <DailyPerformanceTable 
            data={detailedVisitData} 
            isLoading={isLoading} 
          />
        )}

        {/* Only show location data if we have visitor data */}
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

        {/* User location card */}
        <UserLocationCard 
          userLocationData={userLocationData} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
