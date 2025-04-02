import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { DateRangeFilter } from '@/components/analytics/DateRangeFilter';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAnalyticsData } from '@/hooks/analytics/use-analytics-data';

export const AnalyticsContainer: React.FC = () => {
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
  
  const effectiveTimeRange = customRangeString || timeRange;
  
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
  
  const hasVisitorData = summary.totalVisitors > 0;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_analytics_dashboard', {
        time_range: effectiveTimeRange
      });
    }
    
    setTimeout(() => {
      refetchData();
      toast.success('Analytics data refreshed', {
        position: 'bottom-right',
        duration: 2000,
      });
    }, 1000);
  }, [effectiveTimeRange, refetchData]);

  const topLocation = locationData.length > 0 ? locationData[0].name : "No data";
  const topZipCode = detailedZipCodeData.length > 0 ? detailedZipCodeData[0].zipcode : "No data";

  return (
    <>
      <AnalyticsHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        downloadCSV={downloadCSV}
      />

      <div className="flex-1 container mx-auto py-8 px-4">
        <DateRangeFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          applyCustomRange={applyCustomRange}
        />
        
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
        
        <AnalyticsDashboard 
          isLoading={isLoading}
          timeRange={effectiveTimeRange}
          summary={summary}
          dailyVisitorsData={dailyVisitorsData}
          conversionFunnelData={conversionFunnelData}
          popularPagesData={popularPagesData}
          pageVisitDetails={pageVisitDetails}
          hourlyActivityData={hourlyActivityData}
          monthlyTrendData={monthlyTrendData}
          detailedVisitData={detailedVisitData}
          locationData={locationData}
          detailedLocationData={detailedLocationData}
          detailedZipCodeData={detailedZipCodeData}
          weeklyHeatMapData={weeklyHeatMapData}
          downloadPageVisitCSV={downloadPageVisitCSV}
          hasVisitorData={hasVisitorData}
          topLocation={topLocation}
          topZipCode={topZipCode}
        />
      </div>
    </>
  );
};
