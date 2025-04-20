
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationPerformanceTableProps {
  data: any[];
  isLoading: boolean;
  title: string;
  description: string;
}

export const LocationPerformanceTable: React.FC<LocationPerformanceTableProps> = ({
  data,
  isLoading,
  title,
  description
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No location data available for the selected time period
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Visitors</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((location, index) => (
                  <TableRow key={index}>
                    <TableCell>{location.city}, {location.region}</TableCell>
                    <TableCell>{location.visitors}</TableCell>
                    <TableCell>{location.submissions}</TableCell>
                    <TableCell>{location.convRate}</TableCell>
                    <TableCell>{location.avgTime}</TableCell>
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
