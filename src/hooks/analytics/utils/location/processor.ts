
import { extractCityFromLocation, extractZipFromLocation } from './extractors';
import { createDetailedLocationData, createDetailedZipCodeData } from './detailed-data';

/**
 * Process location data from visits and submissions
 */
export const processLocationData = (
  visits: any[], 
  submissions: any[],
  setLocationData: (data: any[]) => void,
  setZipCodeData: (data: any[]) => void,
  setDetailedLocationData: (data: any[]) => void,
  setDetailedZipCodeData: (data: any[]) => void
) => {
  if (!visits || visits.length === 0) {
    resetLocationData(setLocationData, setZipCodeData, setDetailedLocationData, setDetailedZipCodeData);
    return;
  }

  // Process city and zip data
  const cityData = processCityData(visits, submissions);
  const { zipData, zipMap } = processZipCodeData(visits, submissions);
  
  // Process detailed location data
  const detailedLocData = createDetailedLocationData(cityData, visits);
  const detailedZipData = createDetailedZipCodeData(zipData, zipMap, visits);

  // Set all data
  setLocationData(cityData);
  setZipCodeData(zipData);
  setDetailedLocationData(detailedLocData);
  setDetailedZipCodeData(detailedZipData);
};

/**
 * Reset all location data states
 */
const resetLocationData = (
  setLocationData: (data: any[]) => void,
  setZipCodeData: (data: any[]) => void,
  setDetailedLocationData: (data: any[]) => void,
  setDetailedZipCodeData: (data: any[]) => void
) => {
  setLocationData([]);
  setZipCodeData([]);
  setDetailedLocationData([]);
  setDetailedZipCodeData([]);
};

/**
 * Process city data from visits and submissions
 */
const processCityData = (visits: any[], submissions: any[]): any[] => {
  // Process city data
  const cityMap = createCityVisitorsMap(visits);
  addSubmissionsToCityMap(submissions, cityMap);
  
  const cityData = convertCityMapToArray(cityMap);
  return consolidateSmallCities(cityData);
};

/**
 * Create map of cities with visitor counts
 */
const createCityVisitorsMap = (visits: any[]): Map<string, { visitors: number, submissions: number }> => {
  const cityMap = new Map();
  visits.forEach(visit => {
    if (visit.city) {
      if (!cityMap.has(visit.city)) {
        cityMap.set(visit.city, { visitors: 0, submissions: 0 });
      }
      cityMap.get(visit.city).visitors += 1;
    }
  });
  return cityMap;
};

/**
 * Add submission data to city map
 */
const addSubmissionsToCityMap = (
  submissions: any[], 
  cityMap: Map<string, { visitors: number, submissions: number }>
) => {
  submissions.forEach(sub => {
    if (sub.location) {
      const city = extractCityFromLocation(sub.location);
      if (city && cityMap.has(city)) {
        cityMap.get(city).submissions += 1;
      }
    }
  });
};

/**
 * Convert city map to array and sort by visitors
 */
const convertCityMapToArray = (
  cityMap: Map<string, { visitors: number, submissions: number }>
): any[] => {
  return Array.from(cityMap.entries()).map(([name, data]) => ({
    name,
    visitors: data.visitors,
    submissions: data.submissions
  })).sort((a, b) => b.visitors - a.visitors);
};

/**
 * Consolidate smaller cities into an "Other" category
 */
const consolidateSmallCities = (cityData: any[]): any[] => {
  if (cityData.length > 6) {
    const otherCities = cityData.slice(6);
    const otherVisitors = otherCities.reduce((sum, city) => sum + city.visitors, 0);
    const otherSubmissions = otherCities.reduce((sum, city) => sum + city.submissions, 0);
    
    cityData.splice(6, cityData.length - 6, {
      name: 'Other',
      visitors: otherVisitors,
      submissions: otherSubmissions
    });
  }
  
  return cityData;
};

/**
 * Process zip code data from visits and submissions
 */
const processZipCodeData = (visits: any[], submissions: any[]): { zipData: any[], zipMap: Map<string, any> } => {
  const zipMap = createZipVisitorsMap(visits);
  addSubmissionsToZipMap(submissions, zipMap);
  
  const zipData = convertZipMapToArray(zipMap);
  return { zipData, zipMap };
};

/**
 * Create map of zip codes with visitor counts and location info
 */
const createZipVisitorsMap = (visits: any[]): Map<string, any> => {
  const zipMap = new Map();
  visits.forEach(visit => {
    if (visit.zipcode) {
      if (!zipMap.has(visit.zipcode)) {
        zipMap.set(visit.zipcode, { 
          visitors: 0, 
          submissions: 0,
          city: visit.city || 'Unknown',
          region: visit.region || 'Unknown'
        });
      }
      zipMap.get(visit.zipcode).visitors += 1;
    }
  });
  return zipMap;
};

/**
 * Add submission data to zip code map
 */
const addSubmissionsToZipMap = (submissions: any[], zipMap: Map<string, any>) => {
  submissions.forEach(sub => {
    if (sub.location) {
      const zip = extractZipFromLocation(sub.location);
      if (zip && zipMap.has(zip)) {
        zipMap.get(zip).submissions += 1;
      }
    }
  });
};

/**
 * Convert zip map to array, calculate conversion rates, and sort by visitors
 */
const convertZipMapToArray = (zipMap: Map<string, any>): any[] => {
  return Array.from(zipMap.entries()).map(([name, data]) => {
    // Ensure numeric types for calculations
    const submissions = typeof data.submissions === 'number' ? data.submissions : 0;
    const visitors = typeof data.visitors === 'number' ? data.visitors : 0;
    
    return {
      name,
      visitors,
      submissions,
      convRate: visitors > 0 ? ((submissions / visitors) * 100).toFixed(1) + '%' : '0.0%'
    };
  }).sort((a, b) => b.visitors - a.visitors).slice(0, 10);
};
