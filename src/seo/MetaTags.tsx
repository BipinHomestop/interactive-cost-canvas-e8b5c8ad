import React from 'react';
import { Helmet } from 'react-helmet';
import { baseMetaTags } from './meta-tags';
import { getMetaTagsForStep, type MetaTagsConfig } from './meta-utils';

interface MetaTagsProps {
  step?: number;
  customMeta?: Partial<MetaTagsConfig>;
}

export const MetaTags: React.FC<MetaTagsProps> = ({ step, customMeta }) => {
  const metaTags = customMeta || getMetaTagsForStep(step);
  
  return (
    <Helmet>
      {/* Basic Meta Tags - Enhanced for SEO */}
      <title>{metaTags.title}</title>
      <meta name="description" content={metaTags.description} />
      <meta name="keywords" content={metaTags.keywords} />
      <meta name="robots" content={metaTags.robots} />
      <meta name="author" content="American Concrete Coatings" />
      <meta name="language" content="en-US" />
      <meta name="revisit-after" content="3 days" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1f2937" />
      <meta name="msapplication-TileColor" content="#1f2937" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Dallas-Fort Worth" />
      <meta name="geo.position" content="32.7767;-96.7970" />
      <meta name="ICBM" content="32.7767, -96.7970" />

      {/* Enhanced Business Meta Tags */}
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />
      <meta name="coverage" content="Dallas-Fort Worth, Texas" />
      <meta name="target" content="homeowners, business owners" />
      <meta name="audience" content="property owners" />
      <meta name="category" content="Home Improvement, Construction, Concrete Coating, Garage Floor Coating" />
      <meta name="classification" content="Business" />

      {/* Open Graph Tags - Enhanced */}
      <meta property="og:title" content={metaTags.og?.title} />
      <meta property="og:description" content={metaTags.og?.description} />
      <meta property="og:image" content={metaTags.og?.image} />
      <meta property="og:image:alt" content={baseMetaTags.og.imageAlt} />
      <meta property="og:image:width" content={baseMetaTags.og.imageWidth} />
      <meta property="og:image:height" content={baseMetaTags.og.imageHeight} />
      <meta property="og:url" content={metaTags.og?.url} />
      <meta property="og:type" content={metaTags.og?.type} />
      <meta property="og:site_name" content={metaTags.og?.siteName} />
      <meta property="og:locale" content={metaTags.og?.locale} />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Business Contact Information */}
      <meta property="business:contact_data:street_address" content="DFW Metroplex" />
      <meta property="business:contact_data:locality" content="Dallas" />
      <meta property="business:contact_data:region" content="Texas" />
      <meta property="business:contact_data:postal_code" content="75201" />
      <meta property="business:contact_data:country_name" content="United States" />
      <meta property="business:contact_data:phone_number" content="817-839-3485" />

      {/* Twitter Tags - Enhanced */}
      <meta name="twitter:card" content={metaTags.twitter?.card} />
      <meta name="twitter:site" content={metaTags.twitter?.site} />
      <meta name="twitter:creator" content={metaTags.twitter?.creator} />
      <meta name="twitter:title" content={metaTags.twitter?.title} />
      <meta name="twitter:description" content={metaTags.twitter?.description} />
      <meta name="twitter:image" content={metaTags.twitter?.image} />
      <meta name="twitter:image:alt" content={baseMetaTags.twitter.imageAlt} />
      <meta name="twitter:domain" content="quote.garagefloorcoatingsdfw.com" />
      <meta name="twitter:url" content={metaTags.og?.url} />

      {/* Technical SEO */}
      <link rel="canonical" href={metaTags.og?.url} />
      <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      <link rel="robots" href="/robots.txt" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//quote.garagefloorcoatingsdfw.com" />
      
      {/* Structured Data for Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["WebSite", "LocalBusiness"],
          "name": "American Concrete Coatings - Garage Floor Coating Calculator",
          "url": "https://quote.garagefloorcoatingsdfw.com/",
          "description": metaTags.description,
          "telephone": "817-839-3485",
          "address": {
            "@type": "PostalAddress",
            "addressRegion": "TX",
            "addressLocality": "Dallas-Fort Worth",
            "addressCountry": "US"
          },
          "areaServed": [
            {
              "@type": "City",
              "name": "Dallas"
            },
            {
              "@type": "City", 
              "name": "Fort Worth"
            },
            {
              "@type": "State",
              "name": "Texas"
            }
          ],
          "serviceType": [
            "Garage Floor Coating",
            "Epoxy Floor Installation", 
            "Polyaspartic Floor Coating",
            "Polyurea Floor Coating",
            "Concrete Floor Repair"
          ],
          "publisher": {
            "@type": "Organization",
            "name": "American Concrete Coatings",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "TX",
              "addressLocality": "Dallas-Fort Worth"
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://quote.garagefloorcoatingsdfw.com/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {/* Favicon Tags */}
      <link rel="apple-touch-icon" sizes="180x180" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/lovable-uploads/210d3cb0-3572-4b21-8013-1759f55423fa.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="icon" href="/favicon.ico" />
    </Helmet>
  );
};