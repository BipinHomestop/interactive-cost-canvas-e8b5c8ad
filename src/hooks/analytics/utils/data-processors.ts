
import { formatPageName } from './format-utils';
import { 
  calculateDailyAvgTime, 
  calculateTimeForLocationGroup, 
  getStartDateFromRange 
} from './date-utils';
import { 
  format, 
  isBefore, 
  differenceInDays, 
  subDays 
} from 'date-fns';

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

/**
 * Calculate form completion rate
 */
export const calculateCompletionRate = (submissions: any[], visits: any[]): number => {
  // Only count unique IP hashes to avoid counting the same user multiple times
  const uniqueVisitors = new Set();
  visits.forEach(visit => {
    if (visit.ip_hash) uniqueVisitors.add(visit.ip_hash);
  });
  
  // Count pages visited per IP hash
  const pagesVisitedByIP: Record<string, Set<string>> = {};
  visits.forEach(visit => {
    if (visit.ip_hash && visit.page_visited) {
      if (!pagesVisitedByIP[visit.ip_hash]) {
        pagesVisitedByIP[visit.ip_hash] = new Set();
      }
      pagesVisitedByIP[visit.ip_hash].add(visit.page_visited);
    }
  });
  
  // Count IPs that started the form (visited contact information page)
  let startedCount = 0;
  Object.values(pagesVisitedByIP).forEach((pageSet) => {
    const pages = Array.from(pageSet);
    // Consider it started if they visited contact info page
    if (pages.some(page => 
      page.toLowerCase().includes('contact') || 
      page.toLowerCase().includes('step/2')
    )) {
      startedCount++;
    }
  });
  
  // Only count complete submissions (with payment_status 'completed' or 'paid')
  const completeSubmissions = submissions.filter(sub => 
    sub.payment_status === 'completed' || sub.payment_status === 'paid'
  );
  const submissionsLength = completeSubmissions.length || 0;
  
  if (startedCount === 0) return 0;
  return parseFloat(((submissionsLength / startedCount) * 100).toFixed(1));
};

/**
 * Count complete and partial submissions
 */
export const countSubmissionsByStatus = (submissions: any[]) => {
  const completeSubmissions = submissions.filter(sub => 
    sub.payment_status === 'completed' || sub.payment_status === 'paid'
  );
  
  // Consider partial if they at least provided contact information
  const partialSubmissions = submissions.filter(sub => 
    sub.payment_status !== 'completed' && 
    sub.payment_status !== 'paid' &&
    sub.name && sub.email && sub.phone // Has contact information
  );
  
  console.log('Submissions breakdown:', {
    total: submissions.length,
    complete: completeSubmissions.length,
    partial: partialSubmissions.length,
    withContact: submissions.filter(sub => sub.name && sub.email && sub.phone).length
  });
  
  return {
    complete: completeSubmissions.length,
    partial: partialSubmissions.length
  };
};

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
 * Process conversion funnel data
 */
export const processConversionFunnelData = (visits: any[], submissions: any[]) => {
  // Group visits by IP hash
  const visitorsByIP: Record<string, any> = {};
  visits.forEach(visit => {
    if (visit.ip_hash) {
      if (!visitorsByIP[visit.ip_hash]) {
        visitorsByIP[visit.ip_hash] = {
          pages: new Set(),
          startedQuote: false,
          completedForm: false
        };
      }
      
      if (visit.page_visited) {
        visitorsByIP[visit.ip_hash].pages.add(visit.page_visited.toLowerCase());
        
        // Check if started quote
        if (visit.page_visited.toLowerCase().includes('garage') || 
            visit.page_visited.toLowerCase().includes('capacity')) {
          visitorsByIP[visit.ip_hash].startedQuote = true;
        }
        
        // Check if completed form - now only checks for contact page
        if (visit.page_visited.toLowerCase().includes('contact')) {
          visitorsByIP[visit.ip_hash].completedForm = true;
        }
      }
    }
  });
  
  // Count unique visitors, started quotes, and completed forms
  const uniqueVisitors = Object.keys(visitorsByIP).length;
  const startedQuote = Object.values(visitorsByIP).filter((v: any) => v.startedQuote).length;
  const completedForm = Object.values(visitorsByIP).filter((v: any) => v.completedForm).length;
  
  // Separate complete and partial submissions
  const { complete, partial } = countSubmissionsByStatus(submissions);
  
  return [
    { name: 'Visitors', value: uniqueVisitors },
    { name: 'Started Quote', value: startedQuote },
    { name: 'Completed Form', value: completedForm },
    { name: 'Partial Submissions', value: partial },
    { name: 'Complete Submissions', value: complete }
  ];
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
 * Process page visit details
 */
export const processPageVisitDetails = (visits: any[]) => {
  const pageVisits: Record<string, number> = {};
  const pageFirstVisits: Record<string, string> = {};
  const pageLastVisits: Record<string, string> = {};
  const pageTimeOnPage: Record<string, number[]> = {};
  const ipPageTimes: Record<string, Array<{page: string, time: Date}>> = {};
  
  // Sort visits by date and time
  const sortedVisits = [...visits].sort((a, b) => {
    const aDateTime = new Date(`${a.visit_date}T${a.visit_time || '00:00:00'}`);
    const bDateTime = new Date(`${b.visit_date}T${b.visit_time || '00:00:00'}`);
    return aDateTime.getTime() - bDateTime.getTime();
  });
  
  // Process visits to calculate time on page
  sortedVisits.forEach((visit) => {
    if (!visit.page_visited || !visit.ip_hash) return;
    
    const pageName = formatPageName(visit.page_visited);
    
    // Count page visits
    pageVisits[pageName] = (pageVisits[pageName] || 0) + 1;
    
    const visitDate = visit.visit_date ? visit.visit_date : null;
    const visitDateTime = new Date(`${visit.visit_date}T${visit.visit_time || '00:00:00'}`);
    
    // Track first visit
    if (visitDate) {
      if (!pageFirstVisits[pageName] || new Date(visitDate) < new Date(pageFirstVisits[pageName])) {
        pageFirstVisits[pageName] = visitDate;
      }
      
      // Track last visit
      if (!pageLastVisits[pageName] || new Date(visitDate) > new Date(pageLastVisits[pageName])) {
        pageLastVisits[pageName] = visitDate;
      }
    }
    
    // Track consecutive page views by the same IP
    if (!ipPageTimes[visit.ip_hash]) {
      ipPageTimes[visit.ip_hash] = [];
    }
    
    ipPageTimes[visit.ip_hash].push({
      page: pageName,
      time: visitDateTime
    });
  });
  
  // Calculate time on page from consecutive views
  Object.values(ipPageTimes).forEach((visits: Array<{page: string, time: Date}>) => {
    if (visits.length > 1) {
      for (let i = 0; i < visits.length - 1; i++) {
        const pageName = visits[i].page;
        const timeOnPage = (visits[i+1].time.getTime() - visits[i].time.getTime()) / 1000;
        
        // Only count reasonable times (less than 30 minutes)
        if (timeOnPage > 0 && timeOnPage < 1800) {
          if (!pageTimeOnPage[pageName]) {
            pageTimeOnPage[pageName] = [];
          }
          pageTimeOnPage[pageName].push(timeOnPage);
        }
      }
    }
  });
  
  // Calculate average time on page
  const pageAvgTimeOnPage: Record<string, string> = {};
  Object.entries(pageTimeOnPage).forEach(([page, times]) => {
    const timeArray = times as number[];
    if (timeArray.length > 0) {
      const avgSeconds = timeArray.reduce((sum, time) => sum + time, 0) / timeArray.length;
      const minutes = Math.floor(avgSeconds / 60);
      const seconds = Math.floor(avgSeconds % 60);
      pageAvgTimeOnPage[page] = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }
  });
  
  // Create final data structure
  const pageDetails = Object.keys(pageVisits).map(page => {
    const totalVisits = pageVisits[page];
    const totalLength = visits.length;
    // Fix the type issue by ensuring we're working with numbers throughout the calculation
    const visitPercentage = totalLength > 0 ? ((totalVisits / totalLength) * 100).toFixed(1) : '0.0';
    
    return {
      page,
      visits: totalVisits,
      percentage: `${visitPercentage}%`,
      avgTimeOnPage: pageAvgTimeOnPage[page] || '0:00',
      firstVisit: pageFirstVisits[page] || 'Unknown',
      lastVisit: pageLastVisits[page] || 'Unknown'
    };
  }).sort((a, b) => b.visits - a.visits);
  
  return pageDetails;
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
 * Process monthly trend data
 */
export const processMonthlyTrendData = (visits: any[], submissions: any[], timeRange: string) => {
  const today = new Date();
  const startDate = getStartDateFromRange(timeRange);
  const months = timeRange === '7d' ? 3 : timeRange === '30d' ? 6 : 12;
  
  const monthlyData = [];
  for (let i = 0; i < months; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    
    if (isBefore(date, startDate) && i > 0) continue;
    
    const monthStr = format(date, 'MMM');
    const yearMonth = format(date, 'yyyy-MM');
    
    const monthVisits = visits.filter(v => {
      if (!v.visit_date) return false;
      return v.visit_date.startsWith(yearMonth);
    });
    
    const monthSubmissions = submissions.filter(s => {
      if (!s.created_at) return false;
      return s.created_at.startsWith(yearMonth);
    });
    
    const { complete, partial } = countSubmissionsByStatus(monthSubmissions);
    
    monthlyData.unshift({
      month: monthStr,
      visitors: monthVisits.length,
      completeSubmissions: complete,
      partialSubmissions: partial
    });
  }
  
  return monthlyData;
};

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
