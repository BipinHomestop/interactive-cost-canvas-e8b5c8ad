
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface PageVisitTableProps {
  pageVisitDetails: any[];
  isLoading: boolean;
  downloadPageVisitCSV: () => void;
}

export const PageVisitTable: React.FC<PageVisitTableProps> = ({
  pageVisitDetails,
  isLoading,
  downloadPageVisitCSV
}) => {
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-[#1A3174]">Page Visit Details</CardTitle>
            <CardDescription>Detailed metrics for each page visited</CardDescription>
          </div>
          <button
            onClick={downloadPageVisitCSV}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-[#1A3174] text-white hover:bg-[#1A3174]/90 h-9 px-4 py-2"
          >
            Download CSV
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : pageVisitDetails.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No page visit data available for the selected time period
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Avg. Time on Page</TableHead>
                  <TableHead>First Visit</TableHead>
                  <TableHead>Last Visit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageVisitDetails.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>{page.page}</TableCell>
                    <TableCell>{page.visits}</TableCell>
                    <TableCell>{page.percentage}</TableCell>
                    <TableCell>{page.avgTimeOnPage}</TableCell>
                    <TableCell>{page.firstVisit}</TableCell>
                    <TableCell>{page.lastVisit}</TableCell>
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
