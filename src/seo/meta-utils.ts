import { baseMetaTags, stepMetaTags, successMetaTags, analyticsMetaTags } from './meta-tags';

export interface MetaTagsConfig {
  title: string;
  description: string;
  keywords?: string;
  robots?: string;
  canonical?: string;
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
      canonical: baseMetaTags.canonical,
      og: {
        title: baseMetaTags.og.title,
        description: baseMetaTags.og.description,
        image: baseMetaTags.og.image,
        type: baseMetaTags.og.type,
        siteName: baseMetaTags.og.siteName,
        locale: baseMetaTags.og.locale,
        url: baseMetaTags.og.url
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
    console.warn(`No meta tags found for step ${step}, falling back to base tags`);
    return getMetaTagsForStep(); // Fallback to base tags
  }

  return {
    title: stepData.title,
    description: stepData.description,
    keywords: stepData.keywords,
    robots: baseMetaTags.robots,
    canonical: stepData.canonical,
    og: {
      title: stepData.og.title,
      description: stepData.og.description,
      image: baseMetaTags.og.image,
      type: baseMetaTags.og.type,
      siteName: baseMetaTags.og.siteName,
      locale: baseMetaTags.og.locale,
      url: stepData.og.url
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
    canonical: successMetaTags.canonical,
    og: {
      title: successMetaTags.og.title,
      description: successMetaTags.og.description,
      image: baseMetaTags.og.image,
      type: baseMetaTags.og.type,
      siteName: baseMetaTags.og.siteName,
      locale: baseMetaTags.og.locale,
      url: successMetaTags.og.url
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
    canonical: analyticsMetaTags.canonical,
    og: {
      title: analyticsMetaTags.title,
      description: analyticsMetaTags.description,
      image: baseMetaTags.og.image,
      type: baseMetaTags.og.type,
      siteName: baseMetaTags.og.siteName,
      locale: baseMetaTags.og.locale,
      url: analyticsMetaTags.canonical
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

export function getCanonicalUrl(step?: number): string {
  if (!step) {
    return baseMetaTags.canonical;
  }
  
  const stepData = stepMetaTags[step as keyof typeof stepMetaTags];
  return stepData?.canonical || baseMetaTags.canonical;
}

export function getSuccessPageCanonicalUrl(): string {
  return successMetaTags.canonical;
}

export function getAnalyticsPageCanonicalUrl(): string {
  return analyticsMetaTags.canonical;
}