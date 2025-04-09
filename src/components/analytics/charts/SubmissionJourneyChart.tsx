
import React from 'react';
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
import { Users, AlertCircle, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToExcel, exportToCSV, exportToPDF } from '@/hooks/analytics/utils/submission-export';

interface SubmissionData {
  submissions: Array<{
    id: string;
    created_at: string;
    location: string;
    name: string;
    email: string;
    phone: string;
    garage_capacity: number;
    garage_finish: string;
    need_stem_walls: string;
    stem_wall_type?: string;
    need_steps?: string;
    need_extra_footage?: string;
    extra_footage?: string;
    current_condition?: string;
    total_price?: number;
    payment_status: string;
  }>;
}

interface SubmissionJourneyChartProps {
  data: SubmissionData;
  isLoading: boolean;
  timeRange: string;
}

export const SubmissionJourneyChart: React.FC<SubmissionJourneyChartProps> = ({ 
  data,
  isLoading,
  timeRange
}) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency for display
  const formatCurrency = (amount?: number) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format status with appropriate styling
  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'incomplete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportExcel = () => {
    exportToExcel(data.submissions, timeRange);
  };

  const handleExportCSV = () => {
    exportToCSV(data.submissions, timeRange);
  };

  const handleExportPDF = () => {
    exportToPDF(data.submissions, timeRange);
  };

  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#1A3174]" />
            <CardTitle className="text-xl text-[#1A3174]">User Submissions</CardTitle>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportExcel}
              disabled={isLoading || data.submissions.length === 0}
            >
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportCSV}
              disabled={isLoading || data.submissions.length === 0}
            >
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportPDF}
              disabled={isLoading || data.submissions.length === 0}
            >
              PDF
            </Button>
          </div>
        </div>
        <CardDescription>Complete record of all calculator submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : data.submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 border border-dashed rounded-lg">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No Submission Data Available</h3>
            <p className="text-sm text-gray-500">No form submissions have been recorded for the selected period.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Date
                    </div>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Garage</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-slate-50">
                    <TableCell className="whitespace-nowrap font-medium">
                      {formatDate(submission.created_at)}
                    </TableCell>
                    <TableCell>{submission.location || 'N/A'}</TableCell>
                    <TableCell>{submission.name || 'N/A'}</TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      <div className="flex flex-col">
                        <span>{submission.email || 'N/A'}</span>
                        <span className="text-gray-500 text-xs">{submission.phone || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{submission.garage_capacity || 'N/A'}-Car</span>
                        <span className="text-gray-500 text-xs capitalize">{submission.garage_finish || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>Stem Walls: {submission.need_stem_walls || 'N/A'}</span>
                        <span>Steps: {submission.need_steps || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(submission.total_price)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(submission.payment_status)}`}>
                        {submission.payment_status || 'Unknown'}
                      </span>
                    </TableCell>
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
