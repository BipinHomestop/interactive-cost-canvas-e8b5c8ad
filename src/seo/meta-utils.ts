import { baseMetaTags, stepMetaTags, successMetaTags, analyticsMetaTags } from './meta-tags';

// Hardcoded base URL - replace with your actual domain
const BASE_URL = 'https://quote.garagefloorcoatingsdfw.com';

// Hardcoded URL generation functions
function getHomepageUrl(): string {
  return `${BASE_URL}/`;
}

function getStepUrl(step: number): string {
  return `${BASE_URL}/step/${step}`;
}

function getSuccessUrl(): string {
  return `${BASE_URL}/success`;
}

function getAnalyticsUrl(): string {
  return `${BASE_URL}/analytics`;
}

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
        url: getHomepageUrl(),
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
      url: getStepUrl(step),
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
      url: getSuccessUrl(),
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
      url: getAnalyticsUrl(),
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

// URL generation functions using hardcoded URLs
export function generatePageUrl(path?: string | number): string {
  if (!path) {
    return getHomepageUrl();
  }
  
  if (typeof path === 'number') {
    return getStepUrl(path);
  }
  
  if (path === 'success') {
    return getSuccessUrl();
  }
  
  if (path === 'analytics') {
    return getAnalyticsUrl();
  }
  
  // Default case for other paths
  return `${BASE_URL}/${path}`;
}

export function getCanonicalUrl(step?: number): string {
  if (!step) {
    return getHomepageUrl();
  }
  return getStepUrl(step);
}

export function getPageUrl(path: string = ''): string {
  if (!path) {
    return getHomepageUrl();
  }
  return `${BASE_URL}/${path}`;
}