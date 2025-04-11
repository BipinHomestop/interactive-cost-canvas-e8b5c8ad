
import React from 'react';
import { ArrowLeft, Phone, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnalyticsHeaderProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  downloadCSV: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  timeRange, 
  setTimeRange,
  downloadCSV
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <>
      <nav className="bg-white shadow-sm py-3 px-4 z-50 sticky top-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-10"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back</span>
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
              className="h-10 border-primary text-primary hover:bg-primary/5"
              onClick={downloadCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`h-10 border-primary text-primary hover:bg-primary/5`}
              onClick={() => window.location.href = "tel:+18175882055"}
            >
              <Phone className="w-4 h-4 mr-2" />
              {!isMobile && <span>Call (817) 588-2055</span>}
              {isMobile && <span>Call Us</span>}
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-6 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-primary">Data Dashboard</h1>
          
          <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm border">
            <Button 
              variant={timeRange === '7d' ? 'default' : 'ghost'} 
              size="sm"
              className={timeRange === '7d' ? 'bg-primary' : 'text-gray-600'}
              onClick={() => setTimeRange('7d')}
            >
              7 Days
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'default' : 'ghost'} 
              size="sm"
              className={timeRange === '30d' ? 'bg-primary' : 'text-gray-600'}
              onClick={() => setTimeRange('30d')}
            >
              30 Days
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'default' : 'ghost'} 
              size="sm"
              className={timeRange === '90d' ? 'bg-primary' : 'text-gray-600'}
              onClick={() => setTimeRange('90d')}
            >
              90 Days
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
