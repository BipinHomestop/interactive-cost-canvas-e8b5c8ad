
import { format, differenceInDays, subDays } from 'date-fns';
import { getStartDateFromRange } from '../date-utils';
import { calculateDailyAvgTime } from '../date-utils';
import { countSubmissionsByStatus } from './submission-processors';

/**
 * Process detailed visit data
 */
export const processDetailedVisitData = (visits: any[], submissions: any[], timeRange: string) => {
  const today = new Date();
  const startDate = getStartDateFromRange(timeRange);
  const days = Math.min(
    timeRange === '7d' ? 7 : timeRange === '30d' ? 14 : 30,
    differenceInDays(today, startDate) + 1
  );
  
  const detailedData = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    // Count visits for this date
    const dayVisits = visits.filter(v => v.visit_date === dateString);
    
    // Group by IP hash to get unique visitor count
    const uniqueVisitors = new Set();
    dayVisits.forEach(visit => {
      if (visit.ip_hash) uniqueVisitors.add(visit.ip_hash);
    });
    
    // Count submissions for this date
    const daySubmissions = submissions.filter(s => {
      if (!s.created_at) return false;
      return s.created_at.startsWith(dateString);
    });
    
    // Count complete and partial submissions separately
    const { complete, partial } = countSubmissionsByStatus(daySubmissions);
    
    // Calculate metrics
    const visitors = uniqueVisitors.size;
    
    let convRate = '0.0%';
    if (visitors > 0) {
      convRate = ((complete / visitors) * 100).toFixed(1) + '%';
    }
    
    // Calculate time on site for this day
    const dayAvgTime = calculateDailyAvgTime(dayVisits);
    
    detailedData.unshift({
      date: dateString,
      visitors,
      completeSubmissions: complete,
      partialSubmissions: partial,
      convRate,
      avgTime: dayAvgTime
    });
  }
  
  return detailedData;
};
