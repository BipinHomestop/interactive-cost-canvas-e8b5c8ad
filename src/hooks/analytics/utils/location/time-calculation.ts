
/**
 * Function to calculate daily average time for a set of visits
 */
export const calculateDailyAvgTime = (visits: any[]): string => {
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

/**
 * Calculate time for location group
 */
export const calculateTimeForLocationGroup = (visits: any[], locationKey: string, locationValue: string): string => {
  // Filter visits for this location
  const locationVisits = visits.filter(v => v[locationKey] === locationValue);
  
  return calculateDailyAvgTime(locationVisits);
};
