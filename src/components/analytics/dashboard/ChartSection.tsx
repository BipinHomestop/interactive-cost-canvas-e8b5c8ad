
import React from 'react';
import { 
  DailyVisitorsChart, 
  ConversionFunnelChart, 
  PopularPagesChart, 
  MonthlyPerformanceChart,
  HourlyActivityChart
} from '@/components/analytics/charts';

interface ChartSectionProps {
  dailyVisitorsData: any[];
  conversionFunnelData: any[];
  popularPagesData: any[];
  monthlyTrendData: any[];
  hourlyActivityData: any[];
  isLoading: boolean;
  hasVisitorData: boolean;
}

export const ChartSection: React.FC<ChartSectionProps> = ({
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
