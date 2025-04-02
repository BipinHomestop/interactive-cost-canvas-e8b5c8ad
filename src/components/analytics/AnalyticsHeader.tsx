
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
    </>
  );
};
