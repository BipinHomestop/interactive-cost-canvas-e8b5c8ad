
import React from 'react';
import { AnalyticsContainer } from '@/components/analytics/AnalyticsContainer';
import { MetaTags } from '@/seo/MetaTags';
import { getAnalyticsPageMetaTags } from '@/seo/meta-utils';
import { useLocation } from 'react-router-dom';

export default function Analytics() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MetaTags customMeta={getAnalyticsPageMetaTags()} pathname={location.pathname} />
      <AnalyticsContainer />
    </div>
  );
}
