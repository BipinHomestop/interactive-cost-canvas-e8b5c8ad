
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  ResponsiveContainer,
  Sankey, 
  SankeyNode,
  SankeyLink,
  Tooltip
} from 'recharts';
import { CHART_COLORS } from './ChartConfig';

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
  const nodeColors = [
    '#1A3174', // Deep blue (start)
    '#4C63B6', // Medium blue
    '#818CF8', // Light blue
    '#A5B4FC', // Lavender
    '#38BDF8', // Sky blue
    '#22C55E', // Success green (completion)
  ];

  const CHART_CONFIG = {
    visitors: { 
      theme: { 
        light: '#1A3174',
        dark: '#1A3174'
      }
    },
    started: {
      theme: {
        light: '#4C63B6',
        dark: '#4C63B6'
      }
    },
    completed: {
      theme: {
        light: '#22C55E',
        dark: '#22C55E'
      }
    }
  };

  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">User Journey Visualization</CardTitle>
        <CardDescription>Step-by-step progression through the calculator</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <div className="h-[400px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <Sankey
                  data={data}
                  nodePadding={50}
                  nodeWidth={10}
                  margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  link={{ stroke: '#d1d5db' }}
                  node={{
                    fill: (nodeProps: SankeyNode) => 
                      nodeColors[nodeProps.index % nodeColors.length],
                    stroke: '#fff'
                  }}
                >
                  <Tooltip content={<ChartTooltipContent />} />
                </Sankey>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
