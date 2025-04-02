
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users,
  FileCheck,
  Percent,
  Clock,
  Building2,
  MapPin,
  FileText
} from 'lucide-react';

interface AnalyticsSummaryCardsProps {
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
}

export const AnalyticsSummaryCards: React.FC<AnalyticsSummaryCardsProps> = ({
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
  const formatTimeOnSite = (seconds: number) => {
    if (seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{totalVisitors}</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complete Submissions</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{completeSubmissions}</div>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Partial Submissions</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{partialSubmissions}</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{conversionRate}%</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Time on Site</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{formatTimeOnSite(avgTimeOnSite)}</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Popular Step</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-xl font-bold line-clamp-1">{mostPopularStep}</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{completionRate}%</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Location</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-xl font-bold truncate">{topLocation}</div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-white col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top ZIP Code</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{topZipCode}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
