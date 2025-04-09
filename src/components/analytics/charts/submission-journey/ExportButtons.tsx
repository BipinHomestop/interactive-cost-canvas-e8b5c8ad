
import React from 'react';
import { Button } from '@/components/ui/button';
import { exportToExcel, exportToCSV, exportToPDF } from '@/hooks/analytics/utils/submission-export';

interface ExportButtonsProps {
  submissions: any[];
  timeRange: string;
  isLoading: boolean;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  submissions, 
  timeRange, 
  isLoading 
}) => {
  const handleExportExcel = () => {
    exportToExcel(submissions, timeRange);
  };

  const handleExportCSV = () => {
    exportToCSV(submissions, timeRange);
  };

  const handleExportPDF = () => {
    exportToPDF(submissions, timeRange);
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleExportExcel}
        disabled={isLoading || submissions.length === 0}
      >
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleExportCSV}
        disabled={isLoading || submissions.length === 0}
      >
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1"
        onClick={handleExportPDF}
        disabled={isLoading || submissions.length === 0}
      >
        PDF
      </Button>
    </div>
  );
};
