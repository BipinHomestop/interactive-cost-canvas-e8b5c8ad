
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface ZipCodePerformanceTableProps {
  data: any[];
  isLoading: boolean;
}

export const ZipCodePerformanceTable: React.FC<ZipCodePerformanceTableProps> = ({
  data,
  isLoading
}) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Zip Code Performance</CardTitle>
        <CardDescription>Performance metrics by zip code</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No zip code data available for the selected time period
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zip Code</TableHead>
                  <TableHead>Visitors</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((zipCode, index) => (
                  <TableRow key={index}>
                    <TableCell>{zipCode.zipCode}</TableCell>
                    <TableCell>{zipCode.visitors}</TableCell>
                    <TableCell>{zipCode.submissions}</TableCell>
                    <TableCell>{zipCode.convRate}</TableCell>
                    <TableCell>{zipCode.avgTime}</TableCell>
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
