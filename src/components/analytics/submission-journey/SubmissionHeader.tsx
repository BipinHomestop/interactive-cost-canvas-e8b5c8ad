
import React from 'react';
import { FileText } from 'lucide-react';

export const SubmissionHeader: React.FC = () => {
  return (
    <div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Submissions</h2>
          <p className="text-sm text-gray-500">Complete record of calculator submissions</p>
        </div>
      </div>
    </div>
  );
};
