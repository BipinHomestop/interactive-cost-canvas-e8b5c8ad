import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM dd, yyyy');
};

export const PageVisitTable = ({ pageVisitDetails, isLoading, downloadPageVisitCSV }: { pageVisitDetails: any[], isLoading: boolean, downloadPageVisitCSV: () => void }) => {
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

export const DailyPerformanceTable = ({ data, isLoading }: { data: any[], isLoading: boolean }) => {
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

type LocationPerformanceTableProps = {
  data: any[];
  isLoading: boolean;
  title: string;
  description: string;
};

export const LocationPerformanceTable: React.FC<LocationPerformanceTableProps> = ({ data, isLoading, title, description }) => {
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

type ZipCodePerformanceTableProps = {
  data: any[];
  isLoading: boolean;
};

export const ZipCodePerformanceTable: React.FC<ZipCodePerformanceTableProps> = ({ data, isLoading }) => {
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
                  <TableHead>City</TableHead>
                  <TableHead>Visitors</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Avg. Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((zip, index) => (
                  <TableRow key={index}>
                    <TableCell>{zip.zipcode}</TableCell>
                    <TableCell>{zip.city}</TableCell>
                    <TableCell>{zip.visitors}</TableCell>
                    <TableCell>{zip.submissions}</TableCell>
                    <TableCell>{zip.convRate}</TableCell>
                    <TableCell>{zip.avgTime}</TableCell>
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
