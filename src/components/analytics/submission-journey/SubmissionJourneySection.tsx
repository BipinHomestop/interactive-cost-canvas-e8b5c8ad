
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { SubmissionJourneyChart } from '../charts/SubmissionJourneyChart';
import { useSubmissionJourneyData } from '@/hooks/analytics/submission-journey/use-submission-journey-data';
import { SubmissionHeader } from './SubmissionHeader';
import { SubmissionSearch } from './SubmissionSearch';

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
    <Card className="shadow-md mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <SubmissionHeader />
        <SubmissionSearch 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </CardHeader>
      <CardContent>
        <SubmissionJourneyChart 
          data={filteredData} 
          isLoading={isLoading || isJourneyLoading}
          timeRange={timeRange}
        />
      </CardContent>
    </Card>
  );
};
