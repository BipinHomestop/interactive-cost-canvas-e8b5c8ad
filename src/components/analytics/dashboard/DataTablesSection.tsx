
import React from 'react';
import { 
  DailyPerformanceTable,
  LocationPerformanceTable,
  ZipCodePerformanceTable
} from '@/components/analytics/tables';

interface DataTablesSectionProps {
  hasVisitorData: boolean;
  summary: {
    totalVisitors: number;
    completeSubmissions: number;
    partialSubmissions: number;
    conversionRate: number;
    avgTimeOnSite: number;
    mostPopularStep: string;
    completionRate: number;
    formSubmissions: number;
  };
  detailedVisitData: any[];
  detailedLocationData: any[];
  detailedZipCodeData: any[];
  isLoading: boolean;
}

export const DataTablesSection: React.FC<DataTablesSectionProps> = ({
  hasVisitorData,
  summary,
  detailedVisitData,
  detailedLocationData,
  detailedZipCodeData,
  isLoading
}) => {
  return (
    <>
      {(hasVisitorData || summary.formSubmissions > 0) && (
        <DailyPerformanceTable 
          data={detailedVisitData} 
          isLoading={isLoading} 
        />
      )}

      {hasVisitorData && (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LocationPerformanceTable 
            data={detailedLocationData} 
            isLoading={isLoading}
            title="Location Performance"
            description="Performance metrics by city"
          />
          
          <ZipCodePerformanceTable 
            data={detailedZipCodeData} 
            isLoading={isLoading} 
          />
        </div>
      )}
    </>
  );
};
