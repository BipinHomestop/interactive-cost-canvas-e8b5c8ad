
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SubmissionSearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export const SubmissionSearch: React.FC<SubmissionSearchProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search submissions..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
