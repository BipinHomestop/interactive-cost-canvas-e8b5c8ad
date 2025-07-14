import { baseMetaTags, stepMetaTags, successMetaTags, analyticsMetaTags } from './meta-tags';

export interface MetaTagsConfig {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  og?: {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    siteName?: string;
    locale?: string;
  };
  twitter?: {
    card: string;
    site?: string;
    creator?: string;
    title: string;
    description: string;
    image?: string;
  };
}

export function getMetaTagsForStep(step?: number): MetaTagsConfig {
  if (!step) {
    return {
      title: baseMetaTags.title,
      description: baseMetaTags.description,
      keywords: baseMetaTags.keywords,
      robots: baseMetaTags.robots,
      og: {
        title: baseMetaTags.og.title,
        description: baseMetaTags.og.description,
        image: baseMetaTags.og.image,
        url: generatePageUrl(),
        type: baseMetaTags.og.type,
        siteName: baseMetaTags.og.siteName,
        locale: baseMetaTags.og.locale
      },
      twitter: {
        card: baseMetaTags.twitter.card,
        site: baseMetaTags.twitter.site,
        creator: baseMetaTags.twitter.creator,
        title: baseMetaTags.twitter.title,
        description: baseMetaTags.twitter.description,
        image: baseMetaTags.twitter.image
      }
    };
  }

  const stepData = stepMetaTags[step as keyof typeof stepMetaTags];
  if (!stepData) {
    return getMetaTagsForStep(); // Fallback to base tags
  }

  return {
    title: stepData.title,
    description: stepData.description,
    keywords: stepData.keywords,
    robots: baseMetaTags.robots,
    og: {
      title: stepData.og.title,
      description: stepData.og.description,
      image: baseMetaTags.og.image,
      url: generatePageUrl(step),
      type: baseMetaTags.og.type,
      siteName: baseMetaTags.og.siteName,
      locale: baseMetaTags.og.locale
    },
    twitter: {
      card: baseMetaTags.twitter.card,
      site: baseMetaTags.twitter.site,
      creator: baseMetaTags.twitter.creator,
      title: stepData.og.title,
      description: stepData.og.description,
      image: baseMetaTags.twitter.image
    }
  };
}

export function getSuccessPageMetaTags(): MetaTagsConfig {
  return {
    title: successMetaTags.title,
    description: successMetaTags.description,
    keywords: successMetaTags.keywords,
    robots: baseMetaTags.robots,
    og: {
      title: successMetaTags.og.title,
      description: successMetaTags.og.description,
      image: baseMetaTags.og.image,
      url: generatePageUrl('success'),
      type: baseMetaTags.og.type,
      siteName: baseMetaTags.og.siteName,
      locale: baseMetaTags.og.locale
    },
    twitter: {
      card: baseMetaTags.twitter.card,
      site: baseMetaTags.twitter.site,
      creator: baseMetaTags.twitter.creator,
      title: successMetaTags.og.title,
      description: successMetaTags.og.description,
      image: baseMetaTags.twitter.image
    }
  };
}

export function getAnalyticsPageMetaTags(): MetaTagsConfig {
  return {
    title: analyticsMetaTags.title,
    description: analyticsMetaTags.description,
    keywords: analyticsMetaTags.keywords,
    robots: analyticsMetaTags.robots,
    og: {
      title: analyticsMetaTags.title,
      description: analyticsMetaTags.description,
      image: baseMetaTags.og.image,
      url: generatePageUrl('analytics'),
      type: baseMetaTags.og.type,
      siteName: baseMetaTags.og.siteName,
      locale: baseMetaTags.og.locale
    },
    twitter: {
      card: baseMetaTags.twitter.card,
      site: baseMetaTags.twitter.site,
      creator: baseMetaTags.twitter.creator,
      title: analyticsMetaTags.title,
      description: analyticsMetaTags.description,
      image: baseMetaTags.twitter.image
    }
  };
}

// Consolidated URL generation function
export function generatePageUrl(path?: string | number): string {
  const baseUrl = baseMetaTags.og.url;
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  if (!path) {
    return baseUrl; // Homepage with trailing slash
  }
  
  if (typeof path === 'number') {
    return `${cleanBaseUrl}/step/${path}`;
  }
  
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBaseUrl}${cleanPath}`;
}

// Keep existing functions for compatibility, but use consolidated logic
export function getCanonicalUrl(step?: number): string {
  return generatePageUrl(step);
}

export function getPageUrl(path: string = ''): string {
  return generatePageUrl(path);
}