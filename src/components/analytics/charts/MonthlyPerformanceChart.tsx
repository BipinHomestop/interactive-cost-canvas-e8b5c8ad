
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CHART_COLORS, CHART_CONFIG } from './ChartConfig';

interface MonthlyPerformanceChartProps {
  data: any[];
  isLoading: boolean;
}

export const MonthlyPerformanceChart: React.FC<MonthlyPerformanceChartProps> = ({ data, isLoading }) => {
  const hasData = data && data.length > 0 && data.some(item => item.visitors > 0 || item.submissions > 0);
  const hasVisitorData = data && data.some(item => item.visitors > 0);
  const hasSubmissionData = data && data.some(item => item.submissions > 0);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Monthly Performance</CardTitle>
        <CardDescription>Trends in visitors and form submissions over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : !hasData ? (
          <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
            No performance data available for the selected time period
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {hasVisitorData && (
                    <Bar 
                      dataKey="visitors" 
                      fill="var(--color-visitors)" 
                      name="Visitors" 
                      barSize={30}
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {hasSubmissionData && (
                    <Line 
                      type="monotone" 
                      dataKey="submissions" 
                      stroke="var(--color-submissions)" 
                      name="Submissions"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  )}
                  <Legend />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
