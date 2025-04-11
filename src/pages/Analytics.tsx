
import React from 'react';
import { Helmet } from 'react-helmet';
import { AnalyticsContainer } from '@/components/analytics/AnalyticsContainer';

export default function Analytics() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>Data Dashboard | American Concrete Coatings</title>
        <meta name="description" content="View analytics and performance metrics for your garage floor coating calculator." />
        <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/analytics" />
      </Helmet>

      <AnalyticsContainer />
    </div>
  );
}
