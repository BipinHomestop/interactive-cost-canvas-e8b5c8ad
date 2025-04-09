
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  ResponsiveContainer,
  Sankey, 
  Tooltip
} from 'recharts';
import { Users, Check, AlertCircle } from 'lucide-react';

interface SubmissionData {
  nodes: Array<{
    name: string;
    value?: number;
  }>;
  links: Array<{
    source: number;
    target: number;
    value: number;
  }>;
}

interface SubmissionJourneyChartProps {
  data: SubmissionData;
  isLoading: boolean;
}

export const SubmissionJourneyChart: React.FC<SubmissionJourneyChartProps> = ({ 
  data,
  isLoading
}) => {
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-[#1A3174]" />
          <CardTitle className="text-xl text-[#1A3174]">User Journey Flow</CardTitle>
        </div>
        <CardDescription>Step-by-step progression through the calculator</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : data.nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 border border-dashed rounded-lg">
            <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-600 mb-1">No Journey Data Available</h3>
            <p className="text-sm text-gray-500">No form submissions have been recorded for the selected period.</p>
          </div>
        ) : (
          <div className="h-[400px]">
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <Sankey
                  data={data}
                  nodePadding={30}
                  nodeWidth={15}
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  link={{ 
                    stroke: '#d1d5db',
                    strokeWidth: 2,
                    fillOpacity: 0.7
                  }}
                  node={{
                    fill: '#4C63B6',
                    stroke: '#fff',
                    strokeWidth: 1
                  }}
                >
                  <Tooltip 
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      
                      const data = payload[0].payload;
                      
                      if (data.source !== undefined) {
                        // Link tooltip
                        const sourceName = data.source.name;
                        const targetName = data.target.name;
                        const value = data.value;
                        
                        return (
                          <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                            <p className="text-sm font-medium">{sourceName} → {targetName}</p>
                            <p className="text-xs mt-1"><span className="font-medium">{value}</span> users proceeded</p>
                          </div>
                        );
                      } else {
                        // Node tooltip
                        return (
                          <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
                            <p className="text-sm font-medium">{data.name}</p>
                            <div className="flex items-center mt-1 text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              <span><span className="font-medium">{data.value || 0}</span> users reached this step</span>
                            </div>
                          </div>
                        );
                      }
                    }}
                  />
                </Sankey>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="flex justify-center mt-4 space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#4C63B6] mr-2"></div>
                <span>Step in journey</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#22C55E] mr-2"></div>
                <span>Completion</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
