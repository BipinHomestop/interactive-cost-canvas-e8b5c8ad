
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface SubmissionTableRowProps {
  submission: {
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
  };
  formatDate: (dateString: string) => string;
  formatCurrency: (amount?: number) => string;
  getStatusBadgeClass: (status: string) => string;
}

export const SubmissionTableRow: React.FC<SubmissionTableRowProps> = ({
  submission,
  formatDate,
  formatCurrency,
  getStatusBadgeClass
}) => {
  return (
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
  );
};
