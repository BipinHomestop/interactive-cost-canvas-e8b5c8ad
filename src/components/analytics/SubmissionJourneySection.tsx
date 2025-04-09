
import React, { useState } from 'react';
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
import { Users, Clock, TrendingUp, Search, TrendingDown, Filter } from 'lucide-react';
import { SubmissionJourneyChart } from './charts/SubmissionJourneyChart';
import { useSubmissionJourneyData } from '@/hooks/analytics/use-submission-journey-data';
import { Input } from '@/components/ui/input';

interface SubmissionJourneySectionProps {
  isLoading: boolean;
  timeRange: string;
}

export const SubmissionJourneySection: React.FC<SubmissionJourneySectionProps> = ({ 
  isLoading,
  timeRange
}) => {
  const { journeyData, stepCompletionData, isJourneyLoading } = useSubmissionJourneyData(timeRange);
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
        />
        
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-[#1A3174]" />
            Step Completion Rates
          </h3>
          {isLoading || isJourneyLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : stepCompletionData.length === 0 ? (
            <div className="flex items-center justify-center h-[100px] border border-dashed rounded-md p-4 text-gray-500 text-sm">
              No completion data available for the selected time range
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold">Step Name</TableHead>
                    <TableHead className="text-right font-semibold">
                      <div className="flex items-center justify-end">
                        <Users className="h-4 w-4 mr-1" />
                        Started
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      <div className="flex items-center justify-end">
                        <Users className="h-4 w-4 mr-1" />
                        Completed
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      <div className="flex items-center justify-end">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Completion Rate
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      <div className="flex items-center justify-end">
                        <Clock className="h-4 w-4 mr-1" />
                        Avg. Time
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stepCompletionData.map((step, index) => (
                    <TableRow key={index} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{step.name}</TableCell>
                      <TableCell className="text-right">{step.started}</TableCell>
                      <TableCell className="text-right">{step.completed}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          {step.completionRate > 70 ? (
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                          ) : step.completionRate > 40 ? (
                            <TrendingUp className="h-4 w-4 text-amber-600 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className={
                            step.completionRate > 70 ? "text-green-600" : 
                            step.completionRate > 40 ? "text-amber-600" : 
                            "text-red-600"
                          }>
                            {step.completionRate}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">{step.avgTimeToComplete}</TableCell>
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
