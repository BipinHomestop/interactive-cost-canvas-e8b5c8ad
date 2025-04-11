
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SubmissionJourneyChart } from '../charts/SubmissionJourneyChart';
import { useSubmissionJourneyData } from '@/hooks/analytics/submission-journey/use-submission-journey-data';
import { SubmissionHeader } from './SubmissionHeader';
import { SubmissionSearch } from './SubmissionSearch';
import { Skeleton } from '@/components/ui/skeleton';

interface SubmissionJourneySectionProps {
  isLoading: boolean;
  timeRange: string;
}

export const SubmissionJourneySection: React.FC<SubmissionJourneySectionProps> = ({ 
  isLoading,
  timeRange
}) => {
  const { journeyData, isJourneyLoading } = useSubmissionJourneyData(timeRange);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = searchTerm 
    ? {
        submissions: journeyData.submissions.filter(sub => 
          (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sub.email && sub.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (sub.location && sub.location.includes(searchTerm)) ||
          (sub.phone && sub.phone.includes(searchTerm))
        )
      } 
    : journeyData;
  
  return (
    <div className="bg-transparent">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b">
        <SubmissionHeader />
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <SubmissionSearch 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>
      </div>
      <div className="p-6">
        {isLoading || isJourneyLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full max-w-md" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <SubmissionJourneyChart 
            data={filteredData} 
            isLoading={false}
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  );
};
