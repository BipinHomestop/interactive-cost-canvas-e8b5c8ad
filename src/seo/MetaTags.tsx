
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
      
      {/* Enhanced SEO Meta Tags */}
      <meta name="theme-color" content="#1a202c" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Dallas-Fort Worth, Texas" />
      <meta name="geo.position" content="32.7767;-96.7970" />
      <meta name="ICBM" content="32.7767, -96.7970" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="all" />
      <meta name="audience" content="all" />
      <meta name="category" content="Home Improvement, Construction, Concrete Coating" />
      <meta name="classification" content="Business" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={metaTags.og.title} />
      <meta property="og:description" content={metaTags.og.description} />
      <meta property="og:image" content={metaTags.og.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Garage floor coating calculator - Get instant quotes" />
      <meta property="og:url" content={metaTags.og.url} />
      <meta property="og:type" content={metaTags.og.type} />
      <meta property="og:site_name" content={metaTags.og.siteName} />
      <meta property="og:locale" content={metaTags.og.locale} />
      <meta property="business:contact_data:street_address" content="DFW Metroplex" />
      <meta property="business:contact_data:locality" content="Dallas" />
      <meta property="business:contact_data:region" content="Texas" />
      <meta property="business:contact_data:postal_code" content="75201" />
      <meta property="business:contact_data:country_name" content="United States" />
      <meta property="business:contact_data:phone_number" content="817-839-3485" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:site" content={metaTags.twitter.site} />
      <meta name="twitter:creator" content={metaTags.twitter.creator} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      <meta name="twitter:image" content={metaTags.twitter.image} />
      <meta name="twitter:image:alt" content="Free garage floor coating calculator" />
      
      <link rel="canonical" href="https://quote.garagefloorcoatingsdfw.com/" />
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      
      {/* Favicon Tags */}
      <link rel="apple-touch-icon" sizes="180x180" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
    </Helmet>
  );
};
