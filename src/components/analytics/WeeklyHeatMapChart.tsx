
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, Rectangle } from 'recharts';
import { Calendar } from 'lucide-react';

interface WeeklyHeatMapChartProps {
  data: Array<{
    day: string;
    value: number;
  }>;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-medium">{payload[0].payload.day}</p>
        <p className="text-sm">{payload[0].payload.value} visits</p>
      </div>
    );
  }
  return null;
};

const CustomizedShape = (props: any) => {
  const { x, y, width, height, value } = props;
  
  // Calculate opacity based on value
  // Find the maximum value in the dataset to normalize
  const maxValue = Math.max(...props.allValues);
  const normalizedValue = value / maxValue;
  const opacity = 0.2 + (normalizedValue * 0.8); // Ensure at least 20% opacity for visibility
  
  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill="#1A3174"
      fillOpacity={opacity}
      rx={4}
      ry={4}
    />
  );
};

export const WeeklyHeatMapChart: React.FC<WeeklyHeatMapChartProps> = ({ data, isLoading }) => {
  // Prepare data for the chart
  const chartData = data.map((item, index) => ({
    x: index,
    y: 0, // Single row heat map
    z: item.value,
    day: item.day,
    value: item.value
  }));
  
  // Get all values for normalization in the CustomizedShape
  const allValues = data.map(item => item.value);
  
  return (
    <Card className="shadow-md mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl text-[#1A3174] flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Traffic Heat Map
          </CardTitle>
          <CardDescription>Visits distribution across days of the week</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[150px] w-full" />
        ) : (
          <div className="h-[150px]">
            <ChartContainer config={{}} className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
                >
                  <XAxis 
                    type="category" 
                    dataKey="x" 
                    name="Day" 
                    tick={false}
                    axisLine={false}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    tick={false}
                    height={1}
                    axisLine={false}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[50, 500]} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={chartData} shape={<CustomizedShape allValues={allValues} />}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-between px-2 mt-2">
              {data.map((item, index) => (
                <div key={index} className="text-xs font-medium">
                  {item.day.substring(0, 3)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
