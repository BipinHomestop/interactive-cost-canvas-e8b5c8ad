
import React from 'react';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  LineChart as RechartsLineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#1A3174', '#4C63B6', '#818CF8', '#A5B4FC', '#C7D2FE'];

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
  },
  started: { 
    theme: { 
      light: '#4C63B6',
      dark: '#4C63B6'
    }
  },
  completed: { 
    theme: { 
      light: '#818CF8',
      dark: '#818CF8'
    }
  },
};

export const DailyVisitorsChart = ({ data, isLoading }) => {
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

export const ConversionFunnelChart = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Conversion Funnel</CardTitle>
        <CardDescription>User journey through the quote process</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PopularPagesChart = ({ data, isLoading }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl text-[#1A3174]">Popular Pages</CardTitle>
        <CardDescription>Most visited sections of the calculator</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <div className="h-[300px]">
            <ChartContainer config={CHART_CONFIG}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  layout="vertical"
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="visits" fill="var(--color-visitors)" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MonthlyPerformanceChart = ({ data, isLoading }) => {
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

export const HourlyActivityChart = ({ data, isLoading }) => {
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
