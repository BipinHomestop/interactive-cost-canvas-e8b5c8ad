
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SubmissionSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SubmissionSearch: React.FC<SubmissionSearchProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="relative w-full md:w-64">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Search submissions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 py-2 w-full rounded-md border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary/20"
      />
    </div>
  );
};
