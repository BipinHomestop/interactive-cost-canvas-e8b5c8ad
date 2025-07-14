import { urlConfig } from './url-utils';

/**
 * Generates dynamic schema data using the current base URL
 * This replaces hardcoded URLs with dynamically detected ones
 */
export function generateSchemaData() {
  const baseUrl = urlConfig.getBaseUrl();
  const websiteUrl = `${baseUrl}/`;
  const organizationId = `${baseUrl}/#organization`;
  const websiteId = `${baseUrl}/#website`;
  const localBusinessId = `${baseUrl}/#localbusiness`;
  const searchUrl = `${baseUrl}/?q={search_term_string}`;
  
  return {
    // Enhanced WebPage Schema for better indexing
    webpage: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${baseUrl}/#webpage`,
      "url": websiteUrl,
      "name": "FREE Garage Floor Coating Calculator | Get Instant Quote & Save Up to $500",
      "description": "Calculate the cost of garage floor coatings and transform your garage in 60 seconds! Get FREE estimate for premium epoxy, polyurea & polyaspartic coatings. DFW's #1 rated contractor with 20+ year warranty.",
      "inLanguage": "en-US",
      "isPartOf": {
        "@type": "WebSite",
        "@id": websiteId
      },
      "about": {
        "@type": "Thing",
        "name": "Garage Floor Coating Calculator"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": websiteUrl
          }
        ]
      },
      "mainEntity": {
        "@type": "SoftwareApplication",
        "name": "Garage Floor Coating Cost Calculator",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    },

    // Enhanced Website Schema
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      "url": websiteUrl,
      "name": "American Concrete Coatings - Garage Floor Coating Calculator",
      "description": "Professional garage floor coating services and instant cost calculator for the Dallas-Fort Worth area.",
      "publisher": {
        "@id": organizationId
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": searchUrl
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": "en-US"
    },

    // Calculator Software Application Schema
    softwareApplication: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Garage Floor Coating Cost Calculator",
      "description": "Free online calculator to estimate garage floor coating costs including epoxy, polyurea, and polyaspartic systems.",
      "url": websiteUrl,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "name": "Free Calculator Tool"
      },
      "author": {
        "@type": "Organization",
        "@id": organizationId
      },
      "featureList": [
        "Instant cost estimates",
        "Multiple coating options",
        "Customizable garage sizes",
        "Professional consultation booking"
      ]
    },

    organization: {
      "@context": "https://schema.org",
      "@type": ["Organization", "LocalBusiness", "HomeAndConstructionBusiness"],
      "@id": organizationId,
      "name": "American Concrete Coatings",
      "alternateName": ["ACC DFW", "Garage Floor Coatings DFW"],
      "legalName": "American Concrete Coatings LLC",
      "url": websiteUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png`,
        "width": "300",
        "height": "100"
      },
      "image": `${baseUrl}/og-image.png`,
      "description": "Premier garage floor coating contractor in Dallas-Fort Worth specializing in epoxy, polyurea, and polyaspartic concrete coatings with over 15 years of experience.",
      "foundingDate": "2008",
      "slogan": "Transform Your Garage, Transform Your Home",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "TX",
        "addressCountry": "US",
        "addressLocality": "Dallas-Fort Worth Metroplex"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "32.7767",
        "longitude": "-96.7970"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "817-839-3485",
          "contactType": "customer service",
          "areaServed": ["TX", "Dallas", "Fort Worth", "Arlington", "Plano", "Irving"],
          "availableLanguage": ["English", "Spanish"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "18:00"
          }
        },
        {
          "@type": "ContactPoint",
          "contactType": "sales",
          "telephone": "817-839-3485",
          "areaServed": "US"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/americanconcretecoatings/",
        "https://www.facebook.com/americanconcretecoatingsdfw",
        "https://www.pinterest.com/americanconcretecoatings/",
        "https://x.com/dfwACC",
        "https://www.tiktok.com/@acc_dfw",
        "https://www.youtube.com/channel/UCGMQa-wnfPo-gdQl013ZQrg",
        "https://birdeye.com/american-concrete-coatings-152165460731942",
        "https://www.bbb.org/us/tx/arlington/profile/concrete-contractors/american-concrete-coatings-0825-1000196267"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284",
        "bestRating": "5",
        "worstRating": "1"
      },
      "award": [
        "BBB A+ Rating",
        "Angie's List Super Service Award",
        "Best of HomeAdvisor"
      ]
    },

    localBusiness: {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "HomeAndConstructionBusiness", "Contractor"],
      "@id": localBusinessId,
      "name": "American Concrete Coatings",
      "image": [
        `${baseUrl}/og-image.png`,
        `${baseUrl}/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png`
      ],
      "url": websiteUrl,
      "description": "Premier garage floor coating contractor in Dallas-Fort Worth. Professional installation of epoxy, polyurea, and polyaspartic concrete coatings for residential and commercial properties. Free estimates and 20+ year warranties.",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "TX",
        "addressCountry": "US",
        "addressLocality": "Dallas-Fort Worth Metroplex"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "32.7767",
        "longitude": "-96.7970"
      },
      "areaServed": [
        {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": "32.7767",
            "longitude": "-96.7970"
          },
          "geoRadius": "80"
        }
      ],
      "priceRange": "$$-$$$",
      "telephone": "817-839-3485",
      "currenciesAccepted": "USD",
      "paymentAccepted": ["Cash", "Credit Card", "Check", "PayPal"],
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "09:00",
          "closes": "16:00"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/americanconcretecoatingsdfw",
        "https://www.instagram.com/americanconcretecoatings",
        "https://www.pinterest.com/americanconcretecoatings/",
        "https://x.com/dfwACC",
        "https://www.tiktok.com/@acc_dfw",
        "https://www.youtube.com/channel/UCGMQa-wnfPo-gdQl013ZQrg"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284",
        "bestRating": "5"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Garage Floor Coating Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Epoxy Floor Coating"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Polyaspartic Floor Coating"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Polyurea Floor Coating"
            }
          }
        ]
      }
    },

    product: {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "Professional Garage Floor Coating Systems",
      "image": [
        `${baseUrl}/og-image.png`,
        `${baseUrl}/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png`
      ],
      "description": "Premium garage floor coating systems including epoxy, polyurea, and polyaspartic coatings. Professional installation with lifetime warranty options for residential and commercial properties in Dallas-Fort Worth.",
      "brand": {
        "@type": "Brand",
        "name": "American Concrete Coatings",
        "logo": `${baseUrl}/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png`
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "American Concrete Coatings"
      },
      "category": "Home Improvement > Flooring > Concrete Coating",
      "model": "Professional Grade Coating Systems",
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "USD",
        "lowPrice": "800",
        "highPrice": "8000",
        "offerCount": "12",
        "availability": "https://schema.org/InStock",
        "offers": [
          {
            "@type": "Offer",
            "name": "Basic Epoxy Coating",
            "priceCurrency": "USD",
            "price": "1200",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "url": websiteUrl,
            "priceValidUntil": "2025-12-31",
            "warranty": {
              "@type": "WarrantyPromise",
              "durationOfWarranty": "P10Y"
            }
          },
          {
            "@type": "Offer",
            "name": "Premium Polyaspartic Coating",
            "priceCurrency": "USD",
            "price": "2800",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "url": websiteUrl,
            "priceValidUntil": "2025-12-31",
            "warranty": {
              "@type": "WarrantyPromise",
              "durationOfWarranty": "P20Y"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284",
        "bestRating": "5"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Installation Time",
          "value": "1-3 days"
        },
        {
          "@type": "PropertyValue",
          "name": "Cure Time",
          "value": "24-48 hours"
        },
        {
          "@type": "PropertyValue",
          "name": "Warranty",
          "value": "Up to 20 years"
        }
      ]
    },

    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Garage Floor Coating Installation",
      "name": "Professional Garage Floor Coating Services",
      "description": "Expert installation of premium garage floor coatings including epoxy, polyurea, and polyaspartic systems. Serving Dallas-Fort Worth with industry-leading warranties and same-day estimates.",
      "provider": {
        "@type": "LocalBusiness",
        "@id": localBusinessId
      },
      "areaServed": [
        {
          "@type": "State",
          "name": "Texas"
        },
        {
          "@type": "City",
          "name": "Dallas"
        },
        {
          "@type": "City",
          "name": "Fort Worth"
        },
        {
          "@type": "City",
          "name": "Arlington"
        },
        {
          "@type": "City",
          "name": "Plano"
        },
        {
          "@type": "City",
          "name": "Irving"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Garage Floor Coating Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Epoxy Floor Coating Installation",
              "description": "Durable epoxy coating system with decorative flakes"
            },
            "price": "1200-3500",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Polyaspartic Floor Coating Installation",
              "description": "Premium fast-cure polyaspartic coating system"
            },
            "price": "2500-6000",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Polyurea Floor Coating Installation",
              "description": "Industrial-grade polyurea coating system"
            },
            "price": "2000-5000",
            "priceCurrency": "USD"
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "284"
      }
    },

    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What locations do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We currently serve major cities across Texas, including Houston, Dallas, Austin, and San Antonio."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer services outside Texas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Currently, we are focused on providing our services within Texas to ensure the highest quality of service."
          }
        },
        {
          "@type": "Question",
          "name": "How long does installation typically take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Installation time varies based on the project scope, but typically takes 2-5 business days."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer free consultations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we offer free initial consultations to discuss your project needs and provide accurate estimates."
          }
        },
        {
          "@type": "Question",
          "name": "How will you use my contact information?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Your information is used solely to communicate about your project and will never be shared with third parties."
          }
        },
        {
          "@type": "Question",
          "name": "When will someone contact me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our team typically reaches out within 1 business day of receiving your information."
          }
        },
        {
          "@type": "Question",
          "name": "Can I specify preferred contact methods?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, just let us know your preferred method of contact when filling out the form."
          }
        },
        {
          "@type": "Question",
          "name": "Is my information secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we use industry-standard encryption to protect your personal information."
          }
        },
        {
          "@type": "Question",
          "name": "How many cars can fit in different garage sizes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A single car garage typically fits one car, a double garage fits two cars, and so on. Consider extra space for storage or workspace when choosing."
          }
        },
        {
          "@type": "Question",
          "name": "What's the recommended size for my needs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Consider your vehicle sizes, storage needs, and available space. We can help you determine the best size during consultation."
          }
        }
      ]
    },

    speakable: {
      "@context": "https://schema.org",
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "h2", ".intro-text"]
    }
  };
}