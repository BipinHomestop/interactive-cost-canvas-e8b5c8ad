
import React from 'react';
import { SubmissionJourneySection } from './submission-journey/SubmissionJourneySection';
import { Card, CardContent } from '@/components/ui/card';

interface AnalyticsDashboardProps {
  isLoading: boolean;
  timeRange: string;
  pageVisitDetails: any[];
  downloadPageVisitCSV: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  isLoading,
  timeRange,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        {/* Main Dashboard Content */}
        <Card className="shadow-sm border-gray-100 bg-white/70 backdrop-blur-sm">
          <CardContent className="p-0">
            <SubmissionJourneySection
              isLoading={isLoading}
              timeRange={timeRange}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
