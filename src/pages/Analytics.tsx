
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Analytics Dashboard for tracking key metrics
export default function Analytics() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
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
  }, []);

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
      </nav>

      <div className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1A3174] mb-8">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Visitors Card */}
          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Total Visitors</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{summary.totalVisitors}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </Card>

          {/* Form Submissions Card */}
          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Form Submissions</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{summary.formSubmissions}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Completed quotes</p>
          </Card>

          {/* Conversion Rate Card */}
          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Conversion Rate</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{summary.conversionRate}%</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Visitors to submissions</p>
          </Card>

          {/* Avg Time on Site Card */}
          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Avg Time on Site</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{summary.avgTimeOnSite} min</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Average session duration</p>
          </Card>

          {/* Most Popular Step Card */}
          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Most Popular Step</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-40" />
            ) : (
              <p className="text-xl font-bold text-[#1A3174]">{summary.mostPopularStep}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Highest engagement</p>
          </Card>

          {/* Completion Rate Card */}
          <Card className="p-6 shadow-md">
            <h2 className="text-lg font-medium text-gray-700 mb-2">Completion Rate</h2>
            {isLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <p className="text-3xl font-bold text-[#1A3174]">{summary.completionRate}%</p>
            )}
            <p className="text-sm text-gray-500 mt-2">Started to completed</p>
          </Card>
        </div>

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
