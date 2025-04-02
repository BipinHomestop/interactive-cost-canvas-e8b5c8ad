
import React from 'react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
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

interface HourlyActivityChartProps {
  data: any[];
  isLoading: boolean;
}

export const HourlyActivityChart: React.FC<HourlyActivityChartProps> = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Hourly Activity</CardTitle>
        <CardDescription>Visitor distribution throughout the day</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={data}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(hour) => `${hour}:00`}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip 
                    content={<ChartTooltipContent />} 
                    formatter={(value, name) => [value, 'Visitors']}
                    labelFormatter={(hour) => `${hour}:00`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitors" 
                    stroke="var(--color-visitors)" 
                    fill="var(--color-visitors)" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
