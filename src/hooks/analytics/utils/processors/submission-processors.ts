
import { format, subDays } from 'date-fns';
import { getStartDateFromRange } from '../date-utils';

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
 * Process monthly submission data when no visit data is available
 */
export const processMonthlySubmissionData = (submissions: any[], timeRange: string) => {
  const today = new Date();
  const months = timeRange === '7d' ? 3 : timeRange === '30d' ? 6 : 12;
  
  const monthlyData = [];
  for (let i = 0; i < months; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthStr = date.toLocaleString('default', { month: 'short' });
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const monthSubmissions = submissions.filter(s => {
      if (!s.created_at) return false;
      return s.created_at.startsWith(yearMonth);
    });
    
    const complete = monthSubmissions.filter(sub => 
      sub.payment_status === 'completed' || sub.payment_status === 'paid'
    ).length;
    
    const partial = monthSubmissions.filter(sub => 
      sub.payment_status !== 'completed' && 
      sub.payment_status !== 'paid' &&
      sub.name && sub.email && sub.phone
    ).length;
    
    monthlyData.unshift({
      month: monthStr,
      visitors: complete + partial, // Use submissions as visitor count
      completeSubmissions: complete,
      partialSubmissions: partial
    });
  }
  
  return monthlyData;
};

/**
 * Process detailed submission data when no visit data is available
 */
export const processDetailedSubmissionData = (submissions: any[], timeRange: string) => {
  const today = new Date();
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 14 : 30;
  
  const detailedData = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const daySubmissions = submissions.filter(s => {
      if (!s.created_at) return false;
      return s.created_at.startsWith(dateString);
    });
    
    const complete = daySubmissions.filter(sub => 
      sub.payment_status === 'completed' || sub.payment_status === 'paid'
    ).length;
    
    const partial = daySubmissions.filter(sub => 
      sub.payment_status !== 'completed' && 
      sub.payment_status !== 'paid' &&
      sub.name && sub.email && sub.phone
    ).length;
    
    const visitors = complete + partial;
    
    detailedData.unshift({
      date: dateString,
      visitors,
      completeSubmissions: complete,
      partialSubmissions: partial,
      convRate: visitors > 0 ? `${((complete / visitors) * 100).toFixed(1)}%` : '0.0%',
      avgTime: '0:00' // No time data available from submissions
    });
  }
  
  return detailedData;
};
