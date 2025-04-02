
import { formatPageName } from '../format-utils';
import { 
  calculateDailyAvgTime, 
  getStartDateFromRange 
} from '../date-utils';
import { 
  format, 
  differenceInDays, 
  subDays 
} from 'date-fns';

/**
 * Process daily visitor data
 */
export const processDailyVisitorsData = (visits: any[], timeRange: string) => {
  const today = new Date();
  const startDate = getStartDateFromRange(timeRange);
  const days = Math.min(7, differenceInDays(today, startDate) + 1);
  
  const dailyData = [];
  for (let i = 0; i < days; i++) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');
    
    const dayVisits = visits.filter(v => v.visit_date === dateString);
    
    dailyData.unshift({
      name: format(date, 'EEE'),
      date: dateString,
      visitors: dayVisits.length
    });
  }
  
  return dailyData;
};

/**
 * Process popular pages data
 */
export const processPopularPagesData = (visits: any[]) => {
  const pageVisits: Record<string, number> = {};
  
  visits.forEach(visit => {
    if (visit.page_visited) {
      const pageName = formatPageName(visit.page_visited);
      pageVisits[pageName] = (pageVisits[pageName] || 0) + 1;
    }
  });
  
  const popularPages = Object.entries(pageVisits)
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 5);
  
  return popularPages.length > 0 ? popularPages : [
    { name: 'No data available', visits: 0 }
  ];
};

/**
 * Process hourly activity data
 */
export const processHourlyActivityData = (visits: any[]) => {
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    visitors: 0
  }));
  
  // Count visits per hour
  visits.forEach(visit => {
    if (visit.visit_time) {
      const hour = parseInt(visit.visit_time.split(':')[0], 10);
      if (!isNaN(hour) && hour >= 0 && hour < 24) {
        hourlyData[hour].visitors += 1;
      }
    }
  });
  
  return hourlyData;
};

/**
 * Process weekly heat map data
 */
export const processWeeklyHeatMapData = (visits: any[]) => {
  const heatMapData = Array(7).fill(0).map((_, dayIndex) => ({
    day: format(new Date(2023, 0, dayIndex + 1), 'EEEE'), // Use a consistent date to get day names
    value: 0
  }));
  
  // Count visits per day of week
  visits.forEach(visit => {
    if (visit.visit_date) {
      const visitDate = new Date(visit.visit_date);
      const dayOfWeek = visitDate.getDay(); // 0 = Sunday, 6 = Saturday
      heatMapData[dayOfWeek].value += 1;
    }
  });
  
  return heatMapData;
};

/**
 * Get the most popular page from visit data
 */
export const determineMostPopularPage = (visits: any[]): string => {
  const pageCount: Record<string, number> = {};
  
  visits.forEach(visit => {
    if (visit.page_visited) {
      pageCount[visit.page_visited] = (pageCount[visit.page_visited] || 0) + 1;
    }
  });
  
  if (Object.keys(pageCount).length === 0) return 'No data';
  
  let mostPopular = '';
  let maxCount = 0;
  
  Object.entries(pageCount).forEach(([page, count]) => {
    const countValue = typeof count === 'number' ? count : 0;
    
    if (countValue > maxCount) {
      mostPopular = page;
      maxCount = countValue;
    }
  });
  
  return formatPageName(mostPopular);
};
