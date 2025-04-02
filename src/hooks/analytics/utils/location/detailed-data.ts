
import { calculateDailyAvgTime } from './time-calculation';

/**
 * Create detailed location data
 */
export const createDetailedLocationData = (cityData: any[], visits: any[]): any[] => {
  return cityData.slice(0, 5).map(city => {
    const cityInfo = visits.find(v => v.city === city.name) || {};
    
    // Ensure numeric types for calculations
    const cityVisitors = typeof city.visitors === 'number' ? city.visitors : 0;
    const citySubmissions = typeof city.submissions === 'number' ? city.submissions : 0;
    const convRate = cityVisitors > 0 ? ((citySubmissions / cityVisitors) * 100).toFixed(1) + '%' : '0.0%';
    
    // Calculate average time for city
    const cityVisits = visits.filter(v => v.city === city.name);
    // Pass all required parameters to calculateTimeForLocationGroup
    const avgTime = calculateDailyAvgTime(cityVisits);
    
    return {
      city: city.name,
      region: cityInfo.region || 'Unknown',
      visitors: cityVisitors,
      submissions: citySubmissions,
      convRate,
      avgTime
    };
  });
};

/**
 * Create detailed zip code data
 */
export const createDetailedZipCodeData = (zipData: any[], zipMap: Map<string, any>, visitsData: any[]): any[] => {
  return zipData.slice(0, 5).map(zip => {
    const zipInfo = zipMap.get(zip.name) || {};
    
    // Ensure numeric types for calculations
    const zipVisitors = typeof zip.visitors === 'number' ? zip.visitors : 0;
    const zipSubmissions = typeof zip.submissions === 'number' ? zip.submissions : 0;
    
    // Calculate average time for zip code
    const zipVisits = visitsData.filter(v => v.zipcode === zip.name);
    
    // Calculate avg time
    const avgTime = calculateDailyAvgTime(zipVisits);
    
    return {
      zipcode: zip.name,
      city: zipInfo.city || 'Unknown',
      visitors: zipVisitors,
      submissions: zipSubmissions,
      convRate: zip.convRate,
      avgTime
    };
  });
};
