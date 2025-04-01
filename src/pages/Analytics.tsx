
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  Phone, 
  ArrowLeft, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Calendar, 
  TrendingUp, 
  Users, 
  Clock, 
  Activity,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Mock data for the charts
const dailyVisitorsData = [
  { name: 'Mon', visitors: 42 },
  { name: 'Tue', visitors: 58 },
  { name: 'Wed', visitors: 45 },
  { name: 'Thu', visitors: 53 },
  { name: 'Fri', visitors: 49 },
  { name: 'Sat', visitors: 32 },
  { name: 'Sun', visitors: 21 },
];

const conversionFunnelData = [
  { name: 'Visitors', value: 245 },
  { name: 'Started Quote', value: 156 },
  { name: 'Completed Form', value: 78 },
  { name: 'Submissions', value: 42 },
];

const popularPagesData = [
  { name: 'Home', visits: 245 },
  { name: 'Garage Finish', visits: 127 },
  { name: 'Garage Size', visits: 102 },
  { name: 'Stem Walls', visits: 87 },
  { name: 'House Steps', visits: 64 },
];

const trafficSourceData = [
  { name: 'Organic Search', value: 55 },
  { name: 'Direct', value: 24 },
  { name: 'Social Media', value: 12 },
  { name: 'Referral', value: 9 },
];

const hourlyActivityData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  visitors: Math.floor(Math.random() * 15) + (i > 7 && i < 22 ? 10 : 2),
}));

const monthlyTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: new Date(0, i).toLocaleString('default', { month: 'short' }),
  visitors: Math.floor(Math.random() * 250) + 150,
  submissions: Math.floor(Math.random() * 50) + 25,
}));

const detailedVisitData = [
  { date: '2023-10-01', visitors: 38, submissions: 7, convRate: '18.4%', avgTime: '3:42' },
  { date: '2023-10-02', visitors: 42, submissions: 8, convRate: '19.0%', avgTime: '4:12' },
  { date: '2023-10-03', visitors: 45, submissions: 6, convRate: '13.3%', avgTime: '3:58' },
  { date: '2023-10-04', visitors: 51, submissions: 9, convRate: '17.6%', avgTime: '4:35' },
  { date: '2023-10-05', visitors: 49, submissions: 8, convRate: '16.3%', avgTime: '4:22' },
  { date: '2023-10-06', visitors: 32, submissions: 5, convRate: '15.6%', avgTime: '3:45' },
  { date: '2023-10-07', visitors: 28, submissions: 4, convRate: '14.3%', avgTime: '3:20' },
];

// Custom colors for charts
const COLORS = ['#1A3174', '#4C63B6', '#818CF8', '#A5B4FC', '#C7D2FE'];
const CHART_CONFIG = {
  visitors: { theme: { light: '#1A3174' } },
  submissions: { theme: { light: '#38BDF8' } },
  started: { theme: { light: '#4C63B6' } },
  completed: { theme: { light: '#818CF8' } },
};

// Analytics Dashboard for tracking key metrics
export default function Analytics() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [summary, setSummary] = useState({
    totalVisitors: 0,
    formSubmissions: 0,
    conversionRate: 0,
    avgTimeOnSite: 0,
    mostPopularStep: '',
    completionRate: 0
  });

  useEffect(() => {
    // Simulate loading analytics data
    const timeout = setTimeout(() => {
      // This would normally be replaced with actual API calls to Google Analytics Data API
      // For now, we'll use mock data
      setSummary({
        totalVisitors: 245,
        formSubmissions: 42,
        conversionRate: 17.1,
        avgTimeOnSite: 4.2,
        mostPopularStep: 'Garage Finish Selection',
        completionRate: 38.4
      });
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [timeRange]);

  // Function to download analytics data as CSV
  const downloadCSV = () => {
    // Create CSV header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Visitors,Submissions,Conversion Rate,Avg Time\n";
    
    // Add data rows
    detailedVisitData.forEach(row => {
      csvContent += `${row.date},${row.visitors},${row.submissions},${row.convRate},${row.avgTime}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_data.csv");
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Analytics Dashboard | American Concrete Coatings</title>
        <meta name="description" content="View analytics and performance metrics for your garage floor coating calculator." />
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/analytics" />
      </Helmet>

      <nav className="bg-white shadow-lg py-3 px-4 z-50 sticky top-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-xs">Back</span>
            </Button>
            <img 
              src="/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png" 
              alt="American Concrete Coatings"
              className={`${isMobile ? 'h-8' : 'h-10'} w-auto ml-2`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5"
              onClick={downloadCSV}
            >
              <Download className="w-4 h-4 mr-1" />
              <span className="text-xs">Export</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`${isMobile ? 'h-9' : 'h-12'} border-[#1A3174] text-[#1A3174] hover:bg-[#1A3174]/5`}
              onClick={() => window.location.href = "tel:+18175882055"}
            >
              <Phone className="w-4 h-4 mr-1" />
              {!isMobile && <span>Call +1 (817) 588-2055</span>}
              {isMobile && <span className="text-xs">Call Us</span>}
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A3174]">Analytics Dashboard</h1>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={timeRange === '7d' ? 'default' : 'outline'} 
              size="sm"
              className={timeRange === '7d' ? 'bg-[#1A3174]' : 'border-[#1A3174] text-[#1A3174]'}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'outline'} 
              size="sm"
              className={timeRange === '30d' ? 'bg-[#1A3174]' : 'border-[#1A3174] text-[#1A3174]'}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'default' : 'outline'} 
              size="sm"
              className={timeRange === '90d' ? 'bg-[#1A3174]' : 'border-[#1A3174] text-[#1A3174]'}
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Total Visitors</h2>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-[#1A3174]">{summary.totalVisitors}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-[#1A3174] opacity-80" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : '90'} days</p>
          </Card>

          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Form Submissions</h2>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-[#1A3174]">{summary.formSubmissions}</p>
                )}
              </div>
              <Activity className="h-8 w-8 text-[#1A3174] opacity-80" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Completed quotes</p>
          </Card>

          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Conversion Rate</h2>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-[#1A3174]">{summary.conversionRate}%</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-[#1A3174] opacity-80" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Visitors to submissions</p>
          </Card>

          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Avg Time on Site</h2>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-[#1A3174]">{summary.avgTimeOnSite} min</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-[#1A3174] opacity-80" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Average session duration</p>
          </Card>

          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Most Popular Step</h2>
                {isLoading ? (
                  <Skeleton className="h-10 w-40" />
                ) : (
                  <p className="text-xl font-bold text-[#1A3174]">{summary.mostPopularStep}</p>
                )}
              </div>
              <BarChart3 className="h-8 w-8 text-[#1A3174] opacity-80" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Highest engagement</p>
          </Card>

          <Card className="p-6 shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-700 mb-2">Completion Rate</h2>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold text-[#1A3174]">{summary.completionRate}%</p>
                )}
              </div>
              <PieChart className="h-8 w-8 text-[#1A3174] opacity-80" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Started to completed</p>
          </Card>
        </div>

        {/* Visitor Trends Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                      <RechartsBarChart data={dailyVisitorsData}>
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
                          data={conversionFunnelData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {conversionFunnelData.map((entry, index) => (
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
        </div>

        {/* Popular Pages and Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                        data={popularPagesData}
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

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-[#1A3174]">Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
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
                          data={trafficSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {trafficSourceData.map((entry, index) => (
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
        </div>

        {/* Monthly Trend */}
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
                    <RechartsLineChart data={monthlyTrendData}>
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

        {/* Hourly Activity */}
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
                    <AreaChart data={hourlyActivityData}>
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

        {/* Detailed Data Table */}
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-[#1A3174]">Daily Performance</CardTitle>
            <CardDescription>Detailed analytics by day</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Visitors</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Avg Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedVisitData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.visitors}</TableCell>
                      <TableCell>{row.submissions}</TableCell>
                      <TableCell>{row.convRate}</TableCell>
                      <TableCell>{row.avgTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card className="p-6 shadow-md">
            <h2 className="text-xl font-medium text-gray-700 mb-4">Analytics Integration</h2>
            <p className="text-gray-600 mb-4">
              This dashboard currently displays simulated data. To view actual analytics:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600">
              <li>Set up your Google Analytics property ID in the index.html file</li>
              <li>Replace the placeholder G-YOUR_MEASUREMENT_ID with your actual GA4 Measurement ID</li>
              <li>For more detailed analytics, consider connecting to the Google Analytics Data API</li>
            </ol>
            <div className="mt-6">
              <Button
                className="bg-[#1A3174] hover:bg-[#132355] text-white"
                onClick={() => window.open('https://analytics.google.com/', '_blank')}
              >
                Open Google Analytics
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
