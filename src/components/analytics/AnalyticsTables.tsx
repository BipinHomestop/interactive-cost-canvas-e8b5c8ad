
import React, { useState, useMemo } from 'react';
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
import { PageVisitFilter } from './PageVisitFilter';

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
  completeSubmissions: number;
  partialSubmissions: number;
  convRate: string;
  avgTime: string;
}

interface LocationDetail {
  city: string;
  region: string;
  visitors: number;
  completeSubmissions: number;
  partialSubmissions: number;
  convRate: string;
  avgTime: string;
}

interface ZipCodeDetail {
  zipcode: string;
  city: string;
  visitors: number;
  completeSubmissions: number;
  partialSubmissions: number;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('visits');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const resetFilters = () => {
    setSearchTerm('');
    setSortBy('visits');
    setSortOrder('desc');
  };
  
  const filteredData = useMemo(() => {
    const filtered = pageVisitDetails.filter(item => 
      item.page.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return [...filtered].sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === 'visits' || sortBy === 'page') {
        valueA = a[sortBy as keyof PageVisitDetail];
        valueB = b[sortBy as keyof PageVisitDetail];
      } 
      else if (sortBy === 'percentage') {
        valueA = parseFloat(a.percentage);
        valueB = parseFloat(b.percentage);
      } 
      else if (sortBy === 'avgTimeOnPage') {
        const getSeconds = (timeStr: string) => {
          const [min, sec] = timeStr.split(':').map(Number);
          return min * 60 + sec;
        };
        valueA = getSeconds(a.avgTimeOnPage);
        valueB = getSeconds(b.avgTimeOnPage);
      }
      else if (sortBy === 'firstVisit' || sortBy === 'lastVisit') {
        valueA = new Date(a[sortBy as 'firstVisit' | 'lastVisit']).getTime();
        valueB = new Date(b[sortBy as 'firstVisit' | 'lastVisit']).getTime();
      }
      
      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }, [pageVisitDetails, searchTerm, sortBy, sortOrder]);
  
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
        <PageVisitFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          onReset={resetFilters}
        />
        
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
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
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
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchTerm 
                      ? "No matching pages found. Try adjusting your search." 
                      : "No page visit data available"}
                  </TableCell>
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
                <TableHead>Complete</TableHead>
                <TableHead>Partial</TableHead>
                <TableHead>Conv. Rate</TableHead>
                <TableHead>Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell>{row.visitors}</TableCell>
                  <TableCell>{row.completeSubmissions}</TableCell>
                  <TableCell>{row.partialSubmissions}</TableCell>
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
                <TableHead>Complete</TableHead>
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
                    <TableCell>{row.completeSubmissions}</TableCell>
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
                <TableHead>Complete</TableHead>
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
                    <TableCell>{row.completeSubmissions}</TableCell>
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
