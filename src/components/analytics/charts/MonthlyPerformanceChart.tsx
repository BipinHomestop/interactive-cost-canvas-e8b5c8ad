
import React from 'react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CHART_CONFIG = {
  visitors: { 
    theme: { 
      light: '#1A3174',
      dark: '#1A3174'
    }
  },
  submissions: { 
    theme: { 
      light: '#38BDF8',
      dark: '#38BDF8'
    }
  }
};

interface MonthlyPerformanceChartProps {
  data: any[];
  isLoading: boolean;
}

export const MonthlyPerformanceChart: React.FC<MonthlyPerformanceChartProps> = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Monthly Performance</CardTitle>
        <CardDescription>Visitors and submissions over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="var(--color-visitors)" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="var(--color-submissions)" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
