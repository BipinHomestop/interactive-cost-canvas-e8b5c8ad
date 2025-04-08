
import { useUserLocationCore } from './core/use-user-location-core';
import { UserLocationData } from './types/location-types';

export const useUserLocation = (timeRange: string = '30d') => {
  const { userLocationData, isLoading, trackPageView } = useUserLocationCore(timeRange);
  
  return { 
    userLocationData,
    isLoading,
    trackPageView
  };
};
