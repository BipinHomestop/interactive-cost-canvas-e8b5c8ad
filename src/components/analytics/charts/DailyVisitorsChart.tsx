
import React from 'react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
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
  }
};

interface DailyVisitorsChartProps {
  data: any[];
  isLoading: boolean;
}

export const DailyVisitorsChart: React.FC<DailyVisitorsChartProps> = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Daily Visitor Trends</CardTitle>
        <CardDescription>Visitor count for the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
