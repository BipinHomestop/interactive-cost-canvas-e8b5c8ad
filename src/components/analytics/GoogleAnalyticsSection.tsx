
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useGoogleAnalyticsData } from '@/hooks/analytics/use-google-analytics-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface GoogleAnalyticsSectionProps {
  isLoading: boolean;
  timeRange: string;
}

export const GoogleAnalyticsSection: React.FC<GoogleAnalyticsSectionProps> = ({ 
  isLoading,
  timeRange
}) => {
  const [gaTimeRange, setGaTimeRange] = useState<string>('30d');
  const { pageTrafficData, isGaLoading, totalUsers, error } = useGoogleAnalyticsData(gaTimeRange);
  const [retryCount, setRetryCount] = useState(0);
  
  // Automatically retry when there's an error
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // This will trigger a re-fetch in the useGoogleAnalyticsData hook
        setGaTimeRange(current => current);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);
  
  return (
    <Card className="shadow-md mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-[#1A3174]">Google Analytics Traffic</CardTitle>
          <CardDescription>Page traffic data from Google Analytics</CardDescription>
        </div>
        <div className="flex items-center">
          <div className="mr-2 text-sm">Time Period:</div>
          <Select value={gaTimeRange} onValueChange={setGaTimeRange}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Google Analytics data available</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                {typeof error === 'string' ? error : 'Failed to connect to Google Analytics. This could be due to missing configuration or network issues.'}
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Google Analytics
              </Button>
            </AlertDescription>
          </Alert>
        )}
      
        {isLoading || isGaLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : pageTrafficData.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No Google Analytics data available for the selected time period
          </div>
        ) : (
          <>
            <div className="bg-blue-50 p-4 rounded-md mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Total Users</h3>
                <p className="text-2xl font-bold text-blue-900">{totalUsers}</p>
              </div>
              <div className="text-sm text-blue-700">
                {gaTimeRange === '7d' ? 'Last 7 days' : 
                 gaTimeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </div>
            </div>
            {pageTrafficData.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Page Path</TableHead>
                      <TableHead className="text-right">Page Views</TableHead>
                      <TableHead className="text-right">Unique Views</TableHead>
                      <TableHead className="text-right">Avg. Time on Page</TableHead>
                      <TableHead className="text-right">Bounce Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageTrafficData.map((page, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{page.pagePath}</TableCell>
                        <TableCell className="text-right">{page.pageViews}</TableCell>
                        <TableCell className="text-right">{page.uniqueViews}</TableCell>
                        <TableCell className="text-right">{page.avgTimeOnPage}</TableCell>
                        <TableCell className="text-right">{page.bounceRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
