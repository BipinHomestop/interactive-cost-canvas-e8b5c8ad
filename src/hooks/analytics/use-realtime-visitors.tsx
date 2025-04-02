import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRealtimeVisitors = () => {
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const [todayVisitors, setTodayVisitors] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get today's date in ISO format for database queries
  const todayDate = new Date().toISOString().split('T')[0];

  // Fetch current day visitors
  const fetchTodayVisitors = async () => {
    try {
      const { count, error } = await supabase
        .from('analytics_location_visits')
        .select('*', { count: 'exact', head: true })
        .eq('visit_date', todayDate);
      
      if (error) {
        console.error('Error fetching today visitors:', error);
        return;
      }
      
      setTodayVisitors(count || 0);
    } catch (err) {
      console.error('Failed to fetch today visitors:', err);
    }
  };

  // Initialize and listen for changes
  useEffect(() => {
    setIsLoading(true);
    
    // Initial fetch for today's total
    fetchTodayVisitors();

    // Set up realtime tracking
    // For active visitors, we're simulating this with a random number between 1-10
    // In production, you would use a more accurate method like presence tracking
    const updateActiveVisitors = () => {
      // Get a base count from session storage if available
      const storedCount = sessionStorage.getItem('activeVisitorCount') || '0';
      const baseCount = parseInt(storedCount, 10);
      
      // Simulate some variability: either keep same, add 1, or remove 1
      const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
      const newCount = Math.max(1, baseCount + variation); // Ensure at least 1 visitor
      
      setActiveVisitors(newCount);
      sessionStorage.setItem('activeVisitorCount', newCount.toString());
    };

    // Update active visitor count and start polling
    updateActiveVisitors();
    const intervalId = setInterval(() => {
      updateActiveVisitors();
    }, 30000); // Update every 30 seconds

    // Subscribe to realtime updates for the analytics_location_visits table
    const analyticsChannel = supabase
      .channel('analytics-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'analytics_location_visits',
        },
        (payload) => {
          console.log('New analytics data:', payload);
          // Increment today's visitor count
          setTodayVisitors(prev => prev + 1);
          
          // Show a subtle notification
          toast.success('New visitor detected!', {
            position: 'bottom-right',
            duration: 2000,
          });
          
          // Also update active visitors slightly
          updateActiveVisitors();
        }
      )
      .subscribe();
    
    setIsLoading(false);
    
    // Cleanup
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(analyticsChannel);
    };
  }, []);

  return {
    activeVisitors,
    todayVisitors,
    isLoading
  };
};
