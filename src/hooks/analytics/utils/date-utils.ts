
import { format, subDays, subMonths } from 'date-fns';

/**
 * Calculate the start date based on time range
 */
export const getStartDateFromRange = (timeRange: string): Date => {
  const today = new Date();
  
  // Check if it's a custom date range
  if (timeRange.includes(':')) {
    const [startDateStr] = timeRange.split(':');
    return new Date(startDateStr);
  }
  
  // Standard ranges
  switch (timeRange) {
    case '7d':
      return subDays(today, 7);
    case '30d':
      return subDays(today, 30);
    case '90d':
      return subDays(today, 90);
    default:
      return subDays(today, 30); // default to 30 days
  }
};

/**
 * Calculate the end date based on time range
 * Only needed for custom ranges, otherwise it's today
 */
export const getEndDateFromRange = (timeRange: string): Date => {
  // Check if it's a custom date range
  if (timeRange.includes(':')) {
    const [, endDateStr] = timeRange.split(':');
    return new Date(endDateStr);
  }
  
  // For standard ranges, end date is today
  return new Date();
};

/**
 * Calculate average time on site
 */
export const calculateAverageTimeOnSite = (visits: any[], timeRange: string): number => {
  // Group by IP hash to find session duration
  const sessionsByIP: Record<string, { visits: any[], totalTimeSeconds: number }> = {};
  
  // Sort visits by date and time
  const sortedVisits = [...visits].sort((a, b) => {
    const aDateTime = new Date(`${a.visit_date}T${a.visit_time || '00:00:00'}`);
    const bDateTime = new Date(`${b.visit_date}T${b.visit_time || '00:00:00'}`);
    return aDateTime.getTime() - bDateTime.getTime();
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
    
    const firstDateTime = new Date(`${firstVisit.visit_date}T${firstVisit.visit_time || '00:00:00'}`);
    const lastDateTime = new Date(`${lastVisit.visit_date}T${lastVisit.visit_time || '00:00:00'}`);
    
    const sessionDuration = (lastDateTime.getTime() - firstDateTime.getTime()) / 1000;
    
    // Only count sessions less than 1 hour to avoid skewing data
    if (sessionDuration > 0 && sessionDuration < 3600) {
      totalSessionTime += sessionDuration;
      sessionCount++;
    }
  });
  
  // Calculate average in minutes
  const avgSeconds = sessionCount > 0 ? totalSessionTime / sessionCount : 0;
  return Math.round(avgSeconds / 60); // Return in minutes
};

/**
 * Calculate daily average time 
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
