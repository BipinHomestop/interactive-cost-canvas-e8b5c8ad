
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface DailyPerformanceTableProps {
  data: any[];
  isLoading: boolean;
}

export const DailyPerformanceTable: React.FC<DailyPerformanceTableProps> = ({
  data,
  isLoading
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };

  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-[#1A3174]">Daily Performance</CardTitle>
            <CardDescription>Detailed daily metrics for visitors and submissions</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No daily performance data available for the selected time period
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Visitors</TableHead>
                  <TableHead className="text-green-600">Complete Submissions</TableHead>
                  <TableHead className="text-amber-500">Partial Submissions</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((day, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(day.date)}</TableCell>
                    <TableCell>{day.visitors}</TableCell>
                    <TableCell className="text-green-600">{day.completeSubmissions || 0}</TableCell>
                    <TableCell className="text-amber-500">{day.partialSubmissions || 0}</TableCell>
                    <TableCell>{day.convRate}</TableCell>
                    <TableCell>{day.avgTime} min</TableCell>
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
