
import React from 'react';
import { Helmet } from 'react-helmet';
import { metaTags } from './meta-tags';

export const MetaTags: React.FC = () => {
  return (
    <Helmet>
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="author" content={metaTags.author} />
      <meta name="google-site-verification" content={metaTags.googleVerification} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="robots" content={metaTags.robots} />
      <meta name="revisit-after" content={metaTags.revisitAfter} />
      <meta name="language" content={metaTags.language} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metaTags.og.title} />
      <meta property="og:description" content={metaTags.og.description} />
      <meta property="og:image" content={metaTags.og.image} />
      <meta property="og:url" content={metaTags.og.url} />
      <meta property="og:type" content={metaTags.og.type} />
      <meta property="og:site_name" content={metaTags.og.siteName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      <meta name="twitter:image" content={metaTags.twitter.image} />
      
      <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/" />
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* Favicon Tags */}
      <link rel="apple-touch-icon" sizes="180x180" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
    </Helmet>
  );
};
