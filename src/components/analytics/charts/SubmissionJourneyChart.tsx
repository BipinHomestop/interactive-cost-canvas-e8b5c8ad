
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { 
  EmptyState, 
  ExportButtons, 
  LoadingState, 
  SubmissionTable 
} from './submission-journey';

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
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-[#1A3174]" />
            <CardTitle className="text-xl text-[#1A3174]">User Submissions</CardTitle>
          </div>
          <ExportButtons 
            submissions={data.submissions} 
            timeRange={timeRange} 
            isLoading={isLoading} 
          />
        </div>
        <CardDescription>Complete record of all calculator submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingState />
        ) : data.submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <SubmissionTable data={data} />
        )}
      </CardContent>
    </Card>
  );
};
