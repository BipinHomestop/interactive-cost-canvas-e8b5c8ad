
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Users } from 'lucide-react';
import { useRealtimeVisitors } from '@/hooks/analytics/use-realtime-visitors';

export const RealtimeVisitorsCard = () => {
  const { activeVisitors, todayVisitors, isLoading } = useRealtimeVisitors();

  return (
    <Card className="shadow-lg border-2 border-[#1A3174]/10 mb-6">
      <CardHeader className="bg-gradient-to-r from-[#1A3174]/5 to-transparent">
        <CardTitle className="text-xl text-[#1A3174] flex items-center gap-2">
          <Activity className="h-5 w-5 animate-pulse" />
          Realtime Visitors
        </CardTitle>
        <CardDescription>Live visitor activity</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-[#1A3174]/5 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Currently Active</p>
            {isLoading ? (
              <Skeleton className="h-12 w-20" />
            ) : (
              <div className="flex items-center">
                <Users className="h-6 w-6 text-[#1A3174] mr-2" />
                <span className="text-3xl font-bold text-[#1A3174]">{activeVisitors}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-[#1A3174]/5 rounded-lg">
            <p className="text-sm font-medium text-gray-600 mb-2">Today's Visitors</p>
            {isLoading ? (
              <Skeleton className="h-12 w-20" />
            ) : (
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-[#1A3174] mr-2" />
                <span className="text-3xl font-bold text-[#1A3174]">{todayVisitors}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
