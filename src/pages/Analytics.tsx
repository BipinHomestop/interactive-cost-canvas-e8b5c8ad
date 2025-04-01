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
  Download,
  MapPin,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const generateDailyVisitorsData = (range) => {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return Array.from({ length: Math.min(days, 7) }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - i);
    const dayName = dayLabels[day.getDay()];
    return {
      name: dayName,
      visitors: Math.floor(Math.random() * 40) + 20,
    };
  }).reverse();
};

const generateConversionFunnelData = (range) => {
  const multiplier = range === '7d' ? 1 : range === '30d' ? 4 : 12;
  
  return [
    { name: 'Visitors', value: Math.floor((Math.random() * 100) + 150) * multiplier },
    { name: 'Started Quote', value: Math.floor((Math.random() * 60) + 70) * multiplier },
    { name: 'Completed Form', value: Math.floor((Math.random() * 30) + 30) * multiplier },
    { name: 'Submissions', value: Math.floor((Math.random() * 20) + 10) * multiplier },
  ];
};

const generatePopularPagesData = (range) => {
  const multiplier = range === '7d' ? 1 : range === '30d' ? 4 : 12;
  
  return [
    { name: 'Home', visits: Math.floor((Math.random() * 50) + 200) * multiplier },
    { name: 'Garage Finish', visits: Math.floor((Math.random() * 30) + 100) * multiplier },
    { name: 'Garage Size', visits: Math.floor((Math.random() * 20) + 80) * multiplier },
    { name: 'Stem Walls', visits: Math.floor((Math.random() * 15) + 70) * multiplier },
    { name: 'House Steps', visits: Math.floor((Math.random() * 10) + 50) * multiplier },
  ];
};

const generateTrafficSourceData = () => {
  return [
    { name: 'Organic Search', value: 55 },
    { name: 'Direct', value: 24 },
    { name: 'Social Media', value: 12 },
    { name: 'Referral', value: 9 },
  ];
};

const generateHourlyActivityData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    visitors: Math.floor(Math.random() * 15) + (i > 7 && i < 22 ? 10 : 2),
  }));
};

const generateMonthlyTrendData = (range) => {
  const months = range === '7d' ? 3 : range === '30d' ? 6 : 12;
  
  return Array.from({ length: months }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      visitors: Math.floor(Math.random() * 250) + 150,
      submissions: Math.floor(Math.random() * 50) + 25,
    };
  }).reverse();
};

const generateDetailedVisitData = (range) => {
  const days = range === '7d' ? 7 : range === '30d' ? 14 : 30;
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const visitors = Math.floor(Math.random() * 30) + 20;
    const submissions = Math.floor(Math.random() * 8) + 2;
    const convRate = ((submissions / visitors) * 100).toFixed(1) + '%';
    const minutes = Math.floor(Math.random() * 3) + 2;
    const seconds = Math.floor(Math.random() * 60);
    const avgTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    return {
      date: date.toISOString().split('T')[0],
      visitors,
      submissions,
      convRate,
      avgTime,
    };
  }).reverse();
};

const generateLocationData = (range) => {
  const multiplier = range === '7d' ? 1 : range === '30d' ? 4 : 12;
  
  return [
    { name: 'Dallas', visitors: Math.floor((Math.random() * 40) + 80) * multiplier, submissions: Math.floor((Math.random() * 10) + 10) * multiplier },
    { name: 'Fort Worth', visitors: Math.floor((Math.random() * 35) + 70) * multiplier, submissions: Math.floor((Math.random() * 8) + 8) * multiplier },
    { name: 'Arlington', visitors: Math.floor((Math.random() * 25) + 50) * multiplier, submissions: Math.floor((Math.random() * 6) + 6) * multiplier },
    { name: 'Plano', visitors: Math.floor((Math.random() * 20) + 40) * multiplier, submissions: Math.floor((Math.random() * 5) + 5) * multiplier },
    { name: 'Irving', visitors: Math.floor((Math.random() * 15) + 30) * multiplier, submissions: Math.floor((Math.random() * 4) + 4) * multiplier },
    { name: 'Garland', visitors: Math.floor((Math.random() * 10) + 20) * multiplier, submissions: Math.floor((Math.random() * 3) + 3) * multiplier },
    { name: 'Other', visitors: Math.floor((Math.random() * 30) + 60) * multiplier, submissions: Math.floor((Math.random() * 7) + 7) * multiplier },
  ];
};

const generateZipCodeData = (range) => {
  const multiplier = range === '7d' ? 1 : range === '30d' ? 4 : 12;
  
  return [
    { name: '75001', visitors: Math.floor((Math.random() * 20) + 30) * multiplier, convRate: ((Math.random() * 5) + 12).toFixed(1) + '%' },
    { name: '75002', visitors: Math.floor((Math.random() * 15) + 25) * multiplier, convRate: ((Math.random() * 5) + 10).toFixed(1) + '%' },
    { name: '75006', visitors: Math.floor((Math.random() * 18) + 28) * multiplier, convRate: ((Math.random() * 5) + 11).toFixed(1) + '%' },
    { name: '75007', visitors: Math.floor((Math.random() * 22) + 32) * multiplier, convRate: ((Math.random() * 5) + 13).toFixed(1) + '%' },
    { name: '75019', visitors: Math.floor((Math.random() * 16) + 26) * multiplier, convRate: ((Math.random() * 5) + 9).toFixed(1) + '%' },
    { name: '75023', visitors: Math.floor((Math.random() * 19) + 29) * multiplier, convRate: ((Math.random() * 5) + 14).toFixed(1) + '%' },
    { name: '75024', visitors: Math.floor((Math.random() * 17) + 27) * multiplier, convRate: ((Math.random() * 5) + 15).toFixed(1) + '%' },
    { name: '75025', visitors: Math.floor((Math.random() * 21) + 31) * multiplier, convRate: ((Math.random() * 5) + 12).toFixed(1) + '%' },
    { name: '75028', visitors: Math.floor((Math.random() * 14) + 24) * multiplier, convRate: ((Math.random() * 5) + 10).toFixed(1) + '%' },
    { name: '75034', visitors: Math.floor((Math.random() * 23) + 33) * multiplier, convRate: ((Math.random() * 5) + 13).toFixed(1) + '%' },
  ];
};

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
  
  const [dailyVisitorsData, setDailyVisitorsData] = useState([]);
  const [conversionFunnelData, setConversionFunnelData] = useState([]);
  const [popularPagesData, setPopularPagesData] = useState([]);
  const [trafficSourceData, setTrafficSourceData] = useState([]);
  const [hourlyActivityData, setHourlyActivityData] = useState([]);
  const [monthlyTrendData, setMonthlyTrendData] = useState([]);
  const [detailedVisitData, setDetailedVisitData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [zipCodeData, setZipCodeData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    
    const timeout = setTimeout(() => {
      const visitors = timeRange === '7d' ? 85 : timeRange === '30d' ? 245 : 780;
      const submissions = timeRange === '7d' ? 14 : timeRange === '30d' ? 42 : 132;
      const convRate = ((submissions / visitors) * 100).toFixed(1);
      
      setSummary({
        totalVisitors: visitors,
        formSubmissions: submissions,
        conversionRate: parseFloat(convRate),
        avgTimeOnSite: timeRange === '7d' ? 3.8 : timeRange === '30d' ? 4.2 : 4.5,
        mostPopularStep: 'Garage Finish Selection',
        completionRate: timeRange === '7d' ? 35.2 : timeRange === '30d' ? 38.4 : 40.1
      });
      
      setDailyVisitorsData(generateDailyVisitorsData(timeRange));
      setConversionFunnelData(generateConversionFunnelData(timeRange));
      setPopularPagesData(generatePopularPagesData(timeRange));
      setTrafficSourceData(generateTrafficSourceData());
      setHourlyActivityData(generateHourlyActivityData());
      setMonthlyTrendData(generateMonthlyTrendData(timeRange));
      setDetailedVisitData(generateDetailedVisitData(timeRange));
      
      setLocationData(generateLocationData(timeRange));
      setZipCodeData(generateZipCodeData(timeRange));
      
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [timeRange]);

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Visitors,Submissions,Conversion Rate,Avg Time\n";
    
    detailedVisitData.forEach(row => {
      csvContent += `${row.date},${row.visitors},${row.submissions},${row.convRate},${row.avgTime}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_data_${timeRange}.csv`);
    document.body.appendChild(link);
    
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-[#1A3174]">City Performance</CardTitle>
              <CardDescription>Visitors and conversions by city</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ChartContainer config={CHART_CONFIG}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={locationData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="visitors" name="Visitors" fill="var(--color-visitors)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="submissions" name="Submissions" fill="var(--color-submissions)" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-[#1A3174]">Top ZIP Codes</CardTitle>
              <CardDescription>Performance metrics by ZIP code</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ZIP Code</TableHead>
                      <TableHead>Visitors</TableHead>
                      <TableHead>Conv. Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {zipCodeData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.visitors}</TableCell>
                        <TableCell>{row.convRate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-[#1A3174]">Service Area Coverage</CardTitle>
              <CardDescription>Visitor distribution across service areas</CardDescription>
            </div>
            <MapPin className="h-6 w-6 text-[#1A3174]" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-700">Dallas-Fort Worth</h3>
                  <span className="text-[#1A3174] font-bold">{timeRange === '7d' ? '64%' : timeRange === '30d' ? '68%' : '71%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#1A3174] h-2 rounded-full" style={{ width: timeRange === '7d' ? '64%' : timeRange === '30d' ? '68%' : '71%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Primary service area</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-700">Surrounding Counties</h3>
                  <span className="text-[#4C63B6] font-bold">{timeRange === '7d' ? '27%' : timeRange === '30d' ? '24%' : '22%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#4C63B6] h-2 rounded-full" style={{ width: timeRange === '7d' ? '27%' : timeRange === '30d' ? '24%' : '22%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Secondary service area</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-700">Out of Service Area</h3>
                  <span className="text-[#818CF8] font-bold">{timeRange === '7d' ? '9%' : timeRange === '30d' ? '8%' : '7%'}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#818CF8] h-2 rounded-full" style={{ width: timeRange === '7d' ? '9%' : timeRange === '30d' ? '8%' : '7%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Visitors outside coverage</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Location Coverage Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">75% of visitors</span> are from ZIP codes with service coverage
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Conversion rate is {timeRange === '7d' ? '18%' : timeRange === '30d' ? '17%' : '16%'} higher</span> in primary service areas
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Top performing ZIP:</span> 75007 with {timeRange === '7d' ? '13.6%' : timeRange === '30d' ? '14.2%' : '15.1%'} conversion rate
                  </p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
