
import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[400px] text-center p-6 border border-dashed rounded-lg">
      <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium text-gray-600 mb-1">No Submission Data Available</h3>
      <p className="text-sm text-gray-500">No form submissions have been recorded for the selected period.</p>
    </div>
  );
};
