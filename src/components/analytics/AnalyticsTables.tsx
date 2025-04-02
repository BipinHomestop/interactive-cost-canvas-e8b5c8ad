
import React from 'react';
import { 
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageVisitDetail {
  page: string;
  visits: number;
  percentage: string;
  avgTimeOnPage: string;
  firstVisit: string;
  lastVisit: string;
}

interface DailyPerformance {
  date: string;
  visitors: number;
  submissions: number;
  convRate: string;
  avgTime: string;
}

interface LocationDetail {
  city: string;
  region: string;
  visitors: number;
  submissions: number;
  convRate: string;
  avgTime: string;
}

interface ZipCodeDetail {
  zipcode: string;
  city: string;
  visitors: number;
  submissions: number;
  convRate: string;
  avgTime: string;
}

interface PageVisitTableProps {
  pageVisitDetails: PageVisitDetail[];
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
            <CardTitle className="text-xl text-[#1A3174]">Page-by-Page Visitor Analytics</CardTitle>
            <CardDescription>Detailed breakdown of visits for each page</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5"
            onClick={downloadPageVisitCSV}
          >
            <Download className="w-4 h-4 mr-1" />
            <span className="text-xs">Export Page Data</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Visits</TableHead>
                <TableHead>% of Total</TableHead>
                <TableHead>Avg Time on Page</TableHead>
                <TableHead>First Visit</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageVisitDetails.length > 0 ? (
                pageVisitDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-[#1A3174]" />
                      {row.page}
                    </TableCell>
                    <TableCell>{row.visits}</TableCell>
                    <TableCell>{row.percentage}</TableCell>
                    <TableCell>{row.avgTimeOnPage}</TableCell>
                    <TableCell>{new Date(row.firstVisit).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(row.lastVisit).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No page visit data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

interface DailyPerformanceTableProps {
  data: DailyPerformance[];
  isLoading: boolean;
}

export const DailyPerformanceTable: React.FC<DailyPerformanceTableProps> = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Daily Performance</CardTitle>
        <CardDescription>Detailed analytics by day</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Visitors</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Conversion Rate</TableHead>
                <TableHead>Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell>{row.visitors}</TableCell>
                  <TableCell>{row.submissions}</TableCell>
                  <TableCell>{row.convRate}</TableCell>
                  <TableCell>{row.avgTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

interface LocationTableProps {
  data: LocationDetail[];
  isLoading: boolean;
  title: string;
  description: string;
}

export const LocationPerformanceTable: React.FC<LocationTableProps> = ({ 
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
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Visitors</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Conv. Rate</TableHead>
                <TableHead>Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.region}</TableCell>
                    <TableCell>{row.visitors}</TableCell>
                    <TableCell>{row.submissions}</TableCell>
                    <TableCell>{row.convRate}</TableCell>
                    <TableCell>{row.avgTime}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No location data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

interface ZipCodeTableProps {
  data: ZipCodeDetail[];
  isLoading: boolean;
}

export const ZipCodePerformanceTable: React.FC<ZipCodeTableProps> = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">ZIP Code Performance</CardTitle>
        <CardDescription>Performance metrics by ZIP code</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ZIP Code</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Visitors</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Conv. Rate</TableHead>
                <TableHead>Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.zipcode}</TableCell>
                    <TableCell>{row.city}</TableCell>
                    <TableCell>{row.visitors}</TableCell>
                    <TableCell>{row.submissions}</TableCell>
                    <TableCell>{row.convRate}</TableCell>
                    <TableCell>{row.avgTime}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">No ZIP code data available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
