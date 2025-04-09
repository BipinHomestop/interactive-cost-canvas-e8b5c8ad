
import React from 'react';
import { Users } from 'lucide-react';
import { CardTitle, CardDescription } from '@/components/ui/card';

export const SubmissionHeader: React.FC = () => {
  return (
    <div>
      <div className="flex items-center space-x-2">
        <Users className="h-5 w-5 text-[#1A3174]" />
        <CardTitle className="text-xl text-[#1A3174]">User Submissions Data</CardTitle>
      </div>
      <CardDescription>Detailed view of all calculator submissions</CardDescription>
    </div>
  );
};
