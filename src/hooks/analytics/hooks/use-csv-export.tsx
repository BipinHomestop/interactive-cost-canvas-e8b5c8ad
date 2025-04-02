
import { useCallback } from 'react';
import { downloadDetailedVisitCSV, downloadPageVisitCSV as exportPageVisitCSV } from '../utils/csv-export';

type UseCsvExportProps = {
  detailedVisitData: any[];
  pageVisitDetails: any[];
  timeRange: string;
};

export const useCsvExport = ({
  detailedVisitData,
  pageVisitDetails,
  timeRange
}: UseCsvExportProps) => {
  const downloadCSV = useCallback(() => {
    downloadDetailedVisitCSV(detailedVisitData, timeRange);
  }, [detailedVisitData, timeRange]);
  
  const downloadPageVisitCSV = useCallback(() => {
    exportPageVisitCSV(pageVisitDetails, timeRange);
  }, [pageVisitDetails, timeRange]);

  return { downloadCSV, downloadPageVisitCSV };
};
