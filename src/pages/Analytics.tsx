
import React from 'react';
import { AnalyticsContainer } from '@/components/analytics/AnalyticsContainer';
import { MetaTags } from '@/seo/MetaTags';
import { getAnalyticsPageMetaTags } from '@/seo/meta-utils';

export default function Analytics() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <MetaTags customMeta={getAnalyticsPageMetaTags()} />
      <AnalyticsContainer />
    </div>
  );
}
