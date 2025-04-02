
import { extractCityFromLocation, extractZipFromLocation } from './format-utils';
import { calculateTimeForLocationGroup } from './date-utils';

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
    setLocationData([]);
    setZipCodeData([]);
    setDetailedLocationData([]);
    setDetailedZipCodeData([]);
    return;
  }

  // Process city data
  const cityMap = new Map();
  visits.forEach(visit => {
    if (visit.city) {
      if (!cityMap.has(visit.city)) {
        cityMap.set(visit.city, { visitors: 0, submissions: 0 });
      }
      cityMap.get(visit.city).visitors += 1;
    }
  });

  submissions.forEach(sub => {
    if (sub.location) {
      const city = extractCityFromLocation(sub.location);
      if (city && cityMap.has(city)) {
        cityMap.get(city).submissions += 1;
      }
    }
  });

  const cityData = Array.from(cityMap.entries()).map(([name, data]) => ({
    name,
    visitors: data.visitors,
    submissions: data.submissions
  })).sort((a, b) => b.visitors - a.visitors);

  // Consolidate smaller locations into "Other"
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

  // Process zip code data
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

  submissions.forEach(sub => {
    if (sub.location) {
      const zip = extractZipFromLocation(sub.location);
      if (zip && zipMap.has(zip)) {
        zipMap.get(zip).submissions += 1;
      }
    }
  });

  const zipData = Array.from(zipMap.entries()).map(([name, data]) => {
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
    // Fixed: Pass all required parameters to calculateTimeForLocationGroup
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
    
    // Fixed: Pass all required parameters to calculateTimeForLocationGroup
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

/**
 * Function to calculate daily average time for a set of visits
 * This is added to avoid changing the date-utils.ts file
 */
const calculateDailyAvgTime = (visits: any[]): string => {
  // Group by IP hash to find session duration
  const sessionsByIP: Record<string, { visits: any[], totalTimeSeconds: number }> = {};
  
  // Sort visits by time
  const sortedVisits = [...visits].sort((a, b) => {
    const aTime = a.visit_time || '00:00:00';
    const bTime = b.visit_time || '00:00:00';
    return aTime.localeCompare(bTime);
  });
  
  // Group visits by IP hash
  sortedVisits.forEach((visit) => {
    if (!visit.ip_hash) return;
    
    if (!sessionsByIP[visit.ip_hash]) {
      sessionsByIP[visit.ip_hash] = {
        visits: [],
        totalTimeSeconds: 0
      };
    }
    
    sessionsByIP[visit.ip_hash].visits.push(visit);
  });
  
  // Calculate session times for each IP
  let totalSessionTime = 0;
  let sessionCount = 0;
  
  Object.values(sessionsByIP).forEach(({ visits }) => {
    if (visits.length < 2) return; // Need at least 2 visits to calculate time
    
    const firstVisit = visits[0];
    const lastVisit = visits[visits.length - 1];
    
    const firstTime = firstVisit.visit_time || '00:00:00';
    const lastTime = lastVisit.visit_time || '00:00:00';
    
    const [firstHour, firstMin, firstSec] = firstTime.split(':').map(Number);
    const [lastHour, lastMin, lastSec] = lastTime.split(':').map(Number);
    
    const firstTotalSecs = firstHour * 3600 + firstMin * 60 + firstSec;
    const lastTotalSecs = lastHour * 3600 + lastMin * 60 + lastSec;
    
    let sessionDuration = lastTotalSecs - firstTotalSecs;
    if (sessionDuration < 0) sessionDuration += 24 * 3600; // Handle midnight crossing
    
    // Only count sessions less than 1 hour to avoid skewing data
    if (sessionDuration > 0 && sessionDuration < 3600) {
      totalSessionTime += sessionDuration;
      sessionCount++;
    }
  });
  
  // Format time
  const avgSeconds = sessionCount > 0 ? totalSessionTime / sessionCount : 0;
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = Math.floor(avgSeconds % 60);
  
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};
