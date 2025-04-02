
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsSummaryCards } from '@/components/analytics/AnalyticsSummaryCards';
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
  
  const { userLocationData } = useUserLocation(timeRange);

  useEffect(() => {
    // Track analytics page view specifically for the analytics dashboard
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_analytics_dashboard', {
        time_range: timeRange
      });
    }
    
    // Log an analytics visit for this page
    const logAnalyticsVisit = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          // Create a hash of the IP for privacy
          const encoder = new TextEncoder();
          const textData = encoder.encode(data.ip + 'garagefloorcoating-salt');
          const hashBuffer = await crypto.subtle.digest('SHA-256', textData);
          const ipHash = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');
          
          // Insert analytics record
          const { error } = await supabase
            .from('analytics_location_visits')
            .insert({
              city: data.city || 'Unknown',
              zipcode: data.postal || 'Unknown',
              region: data.region || 'Unknown',
              country: data.country_name || 'Unknown',
              ip_hash: ipHash,
              visit_date: new Date().toISOString().split('T')[0],
              visit_time: new Date().toTimeString().split(' ')[0],
              page_visited: 'analytics',
              time_range: timeRange
            });
            
          if (error) console.error('Error logging analytics visit:', error);
          else console.log('Analytics visit logged successfully');
          
          // Refetch data after logging the visit
          setTimeout(() => {
            refetchData();
          }, 1000);
        }
      } catch (err) {
        console.error('Failed to log analytics visit:', err);
      }
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
