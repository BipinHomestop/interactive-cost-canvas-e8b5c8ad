
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

interface GoogleAnalyticsSectionProps {
  isLoading: boolean;
  timeRange: string;
}

export const GoogleAnalyticsSection: React.FC<GoogleAnalyticsSectionProps> = ({ 
  isLoading,
  timeRange
}) => {
  const { pageTrafficData, isGaLoading } = useGoogleAnalyticsData(timeRange);
  
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Google Analytics Traffic</CardTitle>
        <CardDescription>Page traffic data from Google Analytics</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading || isGaLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : pageTrafficData.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No Google Analytics data available for the selected time period
          </div>
        ) : (
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
      </CardContent>
    </Card>
  );
};
