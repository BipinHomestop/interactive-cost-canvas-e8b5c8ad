
import { countSubmissionsByStatus } from './submission-processors';
import { formatPageName } from '../format-utils';
import { 
  format, 
  isBefore
} from 'date-fns';
import { getStartDateFromRange } from '../date-utils';

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
