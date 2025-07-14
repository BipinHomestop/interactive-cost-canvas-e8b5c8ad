export const schemaData = {
  // Enhanced WebPage Schema for better indexing
  webpage: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://quote.garagefloorcoatingsdfw.com/#webpage",
    "url": "https://quote.garagefloorcoatingsdfw.com/",
    "name": "FREE Garage Floor Coating Calculator | Get Instant Quote & Save up to $500",
    "description": "Get your FREE garage floor coating estimate in under 60 seconds! Epoxy, Polyurea, Polyaspartic coatings. DFW's #1 rated contractor with 20+ year warranty.",
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://quote.garagefloorcoatingsdfw.com/#website"
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
          "item": "https://quote.garagefloorcoatingsdfw.com/"
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
    "@id": "https://quote.garagefloorcoatingsdfw.com/#website",
    "url": "https://quote.garagefloorcoatingsdfw.com/",
    "name": "American Concrete Coatings - Garage Floor Coating Calculator",
    "description": "Professional garage floor coating services and instant cost calculator for the Dallas-Fort Worth area.",
    "publisher": {
      "@id": "https://quote.garagefloorcoatingsdfw.com/#organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://quote.garagefloorcoatingsdfw.com/?q={search_term_string}"
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
    "url": "https://quote.garagefloorcoatingsdfw.com/",
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
      "@id": "https://quote.garagefloorcoatingsdfw.com/#organization"
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
    "@id": "https://quote.garagefloorcoatingsdfw.com/#organization",
    "name": "American Concrete Coatings",
    "alternateName": ["ACC DFW", "Garage Floor Coatings DFW"],
    "legalName": "American Concrete Coatings LLC",
    "url": "https://quote.garagefloorcoatingsdfw.com/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://quote.garagefloorcoatingsdfw.com/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png",
      "width": "300",
      "height": "100"
    },
    "image": "https://quote.garagefloorcoatingsdfw.com/og-image.png",
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
    "@id": "https://quote.garagefloorcoatingsdfw.com/#localbusiness",
    "name": "American Concrete Coatings",
    "image": [
      "https://quote.garagefloorcoatingsdfw.com/og-image.png",
      "https://quote.garagefloorcoatingsdfw.com/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png"
    ],
    "url": "https://quote.garagefloorcoatingsdfw.com/",
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
      "https://quote.garagefloorcoatingsdfw.com/og-image.png",
      "https://quote.garagefloorcoatingsdfw.com/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png"
    ],
    "description": "Premium garage floor coating systems including epoxy, polyurea, and polyaspartic coatings. Professional installation with lifetime warranty options for residential and commercial properties in Dallas-Fort Worth.",
    "brand": {
      "@type": "Brand",
      "name": "American Concrete Coatings",
      "logo": "https://quote.garagefloorcoatingsdfw.com/lovable-uploads/c072bff9-8118-4dd7-9b73-b8ada113ca3b.png"
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
          "url": "https://quote.garagefloorcoatingsdfw.com/",
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
          "url": "https://quote.garagefloorcoatingsdfw.com/",
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
      "@id": "https://quote.garagefloorcoatingsdfw.com/#localbusiness"
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
        },
        {
          "@type": "Question",
          "name": "Can I expand the garage later?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While possible, it's more cost-effective to build the right size initially. Plan for future needs when choosing your garage capacity."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer custom sizes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we can customize garage sizes to meet your specific needs while adhering to local building codes."
          }
        },
        {
          "@type": "Question",
          "name": "Does the finish affect the price?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, different finishes have varying costs. Premium finishes like granite or slate may affect the final price."
          }
        },
        {
          "@type": "Question",
          "name": "What's the most popular finish?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Snowfall finish is our most popular choice, offering a clean and modern look that complements most home styles."
          }
        },
        {
          "@type": "Question",
          "name": "Will the finish fade or change color over time?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our finishes are designed to be long-lasting and resistant to fading. They maintain their color and appearance for many years with proper maintenance."
          }
        },
        {
          "@type": "Question",
          "name": "How do I choose the best color for my garage?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Consider your home's exterior colors, architectural style, and personal preferences. We recommend selecting a finish that complements your home's existing color scheme."
          }
        },
        {
          "@type": "Question",
          "name": "What are stem walls?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Stem walls are vertical concrete surfaces that form the foundation of your garage, providing structural support and stability."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need stem walls?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It depends on your garage design and local building requirements. Our team can assess your specific needs during consultation."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between standard and large stem walls?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard stem walls are 4 inches thick, while large stem walls offer additional support for larger structures or specific soil conditions."
          }
        },
        {
          "@type": "Question",
          "name": "How long do stem walls last?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Properly constructed stem walls can last the lifetime of your garage with minimal maintenance."
          }
        },
        {
          "@type": "Question",
          "name": "Why might I need steps?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Steps are necessary when there's a height difference between your house and garage entrance for safe and convenient access."
          }
        },
        {
          "@type": "Question",
          "name": "What types of steps are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer various step designs that can be customized to match your home's style and meet safety requirements."
          }
        },
        {
          "@type": "Question",
          "name": "Are the steps covered by warranty?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our steps are covered under our comprehensive warranty package, ensuring long-lasting quality and safety."
          }
        },
        {
          "@type": "Question",
          "name": "Can steps be added later?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While possible, it's more cost-effective to include steps in the initial construction if you think you'll need them."
          }
        },
        {
          "@type": "Question",
          "name": "What is additional square footage?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Additional square footage refers to extra space added to your garage beyond the standard size for storage or workspace."
          }
        },
        {
          "@type": "Question",
          "name": "How much extra space should I add?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Consider your storage needs, workspace requirements, and future plans when deciding on additional square footage."
          }
        },
        {
          "@type": "Question",
          "name": "Does extra footage affect permits?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, additional square footage may affect building permits and local zoning requirements. We'll handle all necessary paperwork."
          }
        },
        {
          "@type": "Question",
          "name": "Can I add space later?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "While possible, it's more cost-effective to include the desired space in the initial construction."
          }
        },
        {
          "@type": "Question",
          "name": "What's the difference between original and existing conditions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Original means no previous coating, while existing means there's an old coating that needs removal before application."
          }
        },
        {
          "@type": "Question",
          "name": "How is existing coating removed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We use professional-grade equipment and techniques to safely remove existing coatings without damaging the surface."
          }
        },
        {
          "@type": "Question",
          "name": "Does removal affect the timeline?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, removing existing coating adds some time to the project, but it's necessary for proper application."
          }
        },
        {
          "@type": "Question",
          "name": "Can you apply over existing coating?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For best results and longevity, we recommend removing existing coatings before applying new ones."
          }
        },
        {
          "@type": "Question",
          "name": "What payment methods do you accept?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We accept all major credit cards and PayPal for secure and convenient payments."
          }
        },
        {
          "@type": "Question",
          "name": "Is the deposit refundable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the deposit is fully refundable if you cancel within 48 hours of booking."
          }
        },
        {
          "@type": "Question",
          "name": "How is the final price calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The final price includes all selected features, materials, and labor costs. Any additional costs are clearly broken down in your quote."
          }
        },
        {
          "@type": "Question",
          "name": "When will I be charged?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You'll only be charged the deposit amount today. The remaining balance is due upon completion of the project."
          }
        }
      ]
  },
  speakable: {
    "@context": "http://schema.org/",
    "@type": "WebPage",
    "name": "Garage Floor Concrete Coating Cost Calculator",
    "speakable": {
      "@type": "SpeakableSpecification",
      "xpath": [
        "/html/head/title",
        "/html/head/meta[@name='description']/@content"
      ]
    },
    "url": "https://quote.garagefloorcoatingsdfw.com/"
  }
};
