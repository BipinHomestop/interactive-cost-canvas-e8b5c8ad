
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { DateRangeFilter } from '@/components/analytics/DateRangeFilter';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
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
    pageVisitDetails,
    downloadCSV,
    downloadPageVisitCSV,
    refetchData
  } = useAnalyticsData(effectiveTimeRange);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_data_dashboard', {
        time_range: effectiveTimeRange
      });
    }
    
    setTimeout(() => {
      refetchData();
      toast.success('Data refreshed', {
        position: 'bottom-right',
        duration: 2000,
      });
    }, 1000);
  }, [effectiveTimeRange, refetchData]);

  return (
    <>
      <AnalyticsHeader 
        timeRange={timeRange} 
        setTimeRange={setTimeRange} 
        downloadCSV={downloadCSV}
      />

      <div className="container mx-auto py-6 px-4">
        {timeRange === 'custom' && (
          <DateRangeFilter
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            applyCustomRange={applyCustomRange}
          />
        )}
        
        <AnalyticsDashboard
          isLoading={isLoading}
          timeRange={effectiveTimeRange}
          pageVisitDetails={pageVisitDetails}
          downloadPageVisitCSV={downloadPageVisitCSV}
        />
      </div>
    </>
  );
};
