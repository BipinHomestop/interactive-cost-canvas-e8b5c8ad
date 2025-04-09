
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Clock } from 'lucide-react';
import { SubmissionTableRow } from './SubmissionTableRow';

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

interface SubmissionTableProps {
  data: SubmissionData;
}

export const SubmissionTable: React.FC<SubmissionTableProps> = ({ data }) => {
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

  return (
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
            <SubmissionTableRow 
              key={submission.id}
              submission={submission}
              formatDate={formatDate}
              formatCurrency={formatCurrency}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
