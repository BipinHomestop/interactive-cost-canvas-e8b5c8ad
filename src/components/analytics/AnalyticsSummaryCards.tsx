
import React from 'react';
import { Users, Activity, TrendingUp, Clock, BarChart3, PieChart, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type SummaryDataProps = {
  totalVisitors: number;
  completeSubmissions: number;
  partialSubmissions: number;
  conversionRate: number;
  avgTimeOnSite: number;
  mostPopularStep: string;
  completionRate: number;
  topLocation: string;
  topZipCode: string;
  isLoading: boolean;
};

export const AnalyticsSummaryCards: React.FC<SummaryDataProps> = ({
  totalVisitors,
  completeSubmissions,
  partialSubmissions,
  conversionRate,
  avgTimeOnSite,
  mostPopularStep,
  completionRate,
  topLocation,
  topZipCode,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Total Visitors</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{totalVisitors}</p>
            )}
          </div>
          <Users className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Real visitor count</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Complete Submissions</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{completeSubmissions}</p>
            )}
          </div>
          <CheckCircle className="h-8 w-8 text-green-600 opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Paid/completed quotes</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Partial Submissions</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-amber-500">{partialSubmissions}</p>
            )}
          </div>
          <AlertCircle className="h-8 w-8 text-amber-500 opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Incomplete quotes</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Conversion Rate</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{conversionRate}%</p>
            )}
          </div>
          <TrendingUp className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Complete submissions/visitors</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Avg Time on Site</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{avgTimeOnSite} min</p>
            )}
          </div>
          <Clock className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Average session duration</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Most Popular Step</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-xl font-bold text-[#1A3174]">{mostPopularStep}</p>
            )}
          </div>
          <BarChart3 className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Highest engagement</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Completion Rate</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{completionRate}%</p>
            )}
          </div>
          <PieChart className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Started to completed</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Top Location</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-xl font-bold text-[#1A3174]">{topLocation}</p>
            )}
          </div>
          <MapPin className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Most active location</p>
      </Card>

      <Card className="p-6 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">Top Zip Code</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-xl font-bold text-[#1A3174]">{topZipCode}</p>
            )}
          </div>
          <CheckCircle className="h-8 w-8 text-[#1A3174] opacity-80" />
        </div>
        <p className="text-sm text-gray-500 mt-2">Highest conversion zip</p>
      </Card>
    </div>
  );
};
