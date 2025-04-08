
import React, { useState } from 'react';
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
  const { pageTrafficData, isGaLoading, totalUsers, error, isConnected } = useGoogleAnalyticsData(gaTimeRange);
  
  const handleConnectGA = () => {
    // In a real implementation, this would open a configuration modal or redirect to Google Analytics setup
    window.open('https://analytics.google.com/', '_blank');
  };
  
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
        {!isConnected && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Google Analytics Not Connected</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                Google Analytics is not properly configured on this site. Connect Google Analytics to view traffic data.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={handleConnectGA}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Google Analytics
              </Button>
            </AlertDescription>
          </Alert>
        )}
      
        {isLoading || isGaLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : isConnected && pageTrafficData.length > 0 ? (
          <>
            <div className="bg-blue-50 p-4 rounded-md mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-800">Total Users</h3>
                <p className="text-2xl font-bold text-blue-900">{totalUsers.toLocaleString()}</p>
              </div>
              <div className="text-sm text-blue-700">
                {gaTimeRange === '7d' ? 'Last 7 days' : 
                 gaTimeRange === '30d' ? 'Last 30 days' : 'Last 90 days'}
              </div>
            </div>
            
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
                      <TableCell className="text-right">{page.pageViews.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{page.uniqueViews.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{page.avgTimeOnPage}</TableCell>
                      <TableCell className="text-right">{page.bounceRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {isConnected ? 'No Google Analytics data available for the selected time period' : 'Connect to Google Analytics to view traffic data'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
