
import { formatPageName } from '../format-utils';

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
