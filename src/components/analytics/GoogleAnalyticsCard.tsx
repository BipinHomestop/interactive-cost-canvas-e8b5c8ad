
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Clock, BarChart, TrendingDown } from 'lucide-react';

interface GoogleAnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: string;
  bounceRate: string;
}

interface GoogleAnalyticsCardProps {
  data: GoogleAnalyticsData;
  isLoading: boolean;
}

export const GoogleAnalyticsCard: React.FC<GoogleAnalyticsCardProps> = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md mb-8 bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Google Analytics Metrics
        </CardTitle>
        <CardDescription className="text-white/90">
          Data from Google Analytics for this time period
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <Skeleton className="h-[100px] w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
            <div className="p-4 md:p-6 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                <Eye className="h-4 w-4 text-blue-500" />
                Page Views
              </div>
              <div className="text-2xl md:text-3xl font-bold text-blue-700">
                {data.pageViews.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 md:p-6 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                <Eye className="h-4 w-4 text-blue-500" />
                Unique Visitors
              </div>
              <div className="text-2xl md:text-3xl font-bold text-blue-700">
                {data.uniqueVisitors.toLocaleString()}
              </div>
            </div>
            
            <div className="p-4 md:p-6 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Avg. Session Duration
              </div>
              <div className="text-2xl md:text-3xl font-bold text-blue-700">
                {data.avgSessionDuration}
              </div>
            </div>
            
            <div className="p-4 md:p-6 flex flex-col items-center justify-center">
              <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
                <TrendingDown className="h-4 w-4 text-blue-500" />
                Bounce Rate
              </div>
              <div className="text-2xl md:text-3xl font-bold text-blue-700">
                {data.bounceRate}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
