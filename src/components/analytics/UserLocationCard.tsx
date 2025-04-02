
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface UserLocationProps {
  userLocationData: {
    latitude: number | null;
    longitude: number | null;
    city: string;
    region: string;
    country: string;
    ip: string;
  };
  isLoading: boolean;
}

export const UserLocationCard: React.FC<UserLocationProps> = ({ userLocationData, isLoading }) => {
  return (
    <Card className="p-6 shadow-md mb-8">
      <h2 className="text-xl font-medium text-[#1A3174] mb-4">Your Current Location</h2>
      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-[#1A3174] mr-2" />
            <span className="font-medium">City:</span>
            <span className="ml-2">{userLocationData.city}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-[#1A3174] mr-2" />
            <span className="font-medium">Region:</span>
            <span className="ml-2">{userLocationData.region}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-[#1A3174] mr-2" />
            <span className="font-medium">Country:</span>
            <span className="ml-2">{userLocationData.country}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            *This information is collected anonymously for analytics purposes only and is not stored with any personally identifiable information.
          </p>
        </div>
      )}
    </Card>
  );
};
