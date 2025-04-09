
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { SubmissionJourneyChart } from './charts/SubmissionJourneyChart';
import { useSubmissionJourneyData } from '@/hooks/analytics/use-submission-journey-data';

interface SubmissionJourneySectionProps {
  isLoading: boolean;
  timeRange: string;
}

export const SubmissionJourneySection: React.FC<SubmissionJourneySectionProps> = ({ 
  isLoading,
  timeRange
}) => {
  const { journeyData, stepCompletionData, isJourneyLoading } = useSubmissionJourneyData(timeRange);
  
  return (
    <Card className="shadow-md mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-[#1A3174]">User Journey Analytics</CardTitle>
          <CardDescription>Analyze how users progress through the cost calculator</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <SubmissionJourneyChart data={journeyData} isLoading={isLoading || isJourneyLoading} />
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Step Completion Rates</h3>
          {isLoading || isJourneyLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Step Name</TableHead>
                    <TableHead className="text-right">Started</TableHead>
                    <TableHead className="text-right">Completed</TableHead>
                    <TableHead className="text-right">Completion Rate</TableHead>
                    <TableHead className="text-right">Avg. Time to Complete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stepCompletionData.map((step, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{step.name}</TableCell>
                      <TableCell className="text-right">{step.started}</TableCell>
                      <TableCell className="text-right">{step.completed}</TableCell>
                      <TableCell className="text-right">
                        <span className={step.completionRate > 70 ? "text-green-600" : step.completionRate > 40 ? "text-amber-600" : "text-red-600"}>
                          {step.completionRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{step.avgTimeToComplete}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
