
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search } from 'lucide-react';
import { SubmissionJourneyChart } from './charts/SubmissionJourneyChart';
import { useSubmissionJourneyData } from '@/hooks/analytics/submission-journey/use-submission-journey-data';
import { Input } from '@/components/ui/input';

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
  
  return (
    <Card className="shadow-md mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#1A3174]" />
            <CardTitle className="text-xl text-[#1A3174]">User Submissions Data</CardTitle>
          </div>
          <CardDescription>Detailed view of all calculator submissions</CardDescription>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search submissions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <SubmissionJourneyChart 
          data={searchTerm 
            ? {
                submissions: journeyData.submissions.filter(sub => 
                  (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (sub.email && sub.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (sub.location && sub.location.includes(searchTerm)) ||
                  (sub.phone && sub.phone.includes(searchTerm))
                )
              } 
            : journeyData
          } 
          isLoading={isLoading || isJourneyLoading}
          timeRange={timeRange}
        />
      </CardContent>
    </Card>
  );
};
