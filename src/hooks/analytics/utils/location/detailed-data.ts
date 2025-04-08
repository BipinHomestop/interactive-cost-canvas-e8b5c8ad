
import { calculateDailyAvgTime } from './time-calculation';

/**
 * Format conversion rate as a percentage
 */
const formatConversionRate = (visitors: number, submissions: number): string => {
  return visitors > 0 
    ? ((submissions / visitors) * 100).toFixed(1) + '%' 
    : '0.0%';
};

/**
 * Extract basic city metrics from raw data
 */
const extractCityMetrics = (city: any, visits: any[]): {
  name: string;
  visitors: number;
  submissions: number;
  region: string;
} => {
  const cityInfo = visits.find(v => v.city === city.name) || {};
  
  // Ensure numeric types for calculations
  const cityVisitors = typeof city.visitors === 'number' ? city.visitors : 0;
  const citySubmissions = typeof city.submissions === 'number' ? city.submissions : 0;
  
  return {
    name: city.name,
    visitors: cityVisitors,
    submissions: citySubmissions,
    region: cityInfo.region || 'Unknown'
  };
};

/**
 * Create detailed location data
 */
export const createDetailedLocationData = (cityData: any[], visits: any[]): any[] => {
  return cityData.slice(0, 5).map(city => {
    const metrics = extractCityMetrics(city, visits);
    const convRate = formatConversionRate(metrics.visitors, metrics.submissions);
    
    // Calculate average time for city
    const cityVisits = visits.filter(v => v.city === city.name);
    const avgTime = calculateDailyAvgTime(cityVisits);
    
    return {
      city: metrics.name,
      region: metrics.region,
      visitors: metrics.visitors,
      submissions: metrics.submissions,
      convRate,
      avgTime
    };
  });
};

/**
 * Extract basic zip code metrics from raw data
 */
const extractZipMetrics = (zip: any, zipMap: Map<string, any>): {
  name: string;
  visitors: number;
  submissions: number;
  city: string;
  convRate: string;
} => {
  const zipInfo = zipMap.get(zip.name) || {};
  
  // Ensure numeric types for calculations
  const zipVisitors = typeof zip.visitors === 'number' ? zip.visitors : 0;
  const zipSubmissions = typeof zip.submissions === 'number' ? zip.submissions : 0;
  
  return {
    name: zip.name,
    visitors: zipVisitors,
    submissions: zipSubmissions,
    city: zipInfo.city || 'Unknown',
    convRate: zip.convRate
  };
};

/**
 * Create detailed zip code data
 */
export const createDetailedZipCodeData = (zipData: any[], zipMap: Map<string, any>, visitsData: any[]): any[] => {
  return zipData.slice(0, 5).map(zip => {
    const metrics = extractZipMetrics(zip, zipMap);
    
    // Calculate average time for zip code
    const zipVisits = visitsData.filter(v => v.zipcode === zip.name);
    const avgTime = calculateDailyAvgTime(zipVisits);
    
    return {
      zipcode: metrics.name,
      city: metrics.city,
      visitors: metrics.visitors,
      submissions: metrics.submissions,
      convRate: metrics.convRate,
      avgTime
    };
  });
};
