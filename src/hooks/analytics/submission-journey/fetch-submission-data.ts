
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStartDateFromRange, getEndDateFromRange } from '../utils/date-utils';
import { SubmissionData } from './types';

export const fetchSubmissionJourneyData = async (
  timeRange: string
): Promise<{ submissions: any[], error: string | null }> => {
  try {
    const startDate = getStartDateFromRange(timeRange);
    const endDate = getEndDateFromRange(timeRange);
    
    const startDateString = startDate.toISOString();
    const endDateString = endDate.toISOString();
    
    // Fetch all submission data
    let query = supabase
      .from('cost_calculator_submissions')
      .select('*')
      .gte('created_at', startDateString);
    
    if (timeRange.includes(':')) {
      query = query.lte('created_at', endDateString);
    }
    
    // Sort by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    const { data: submissions, error: submissionsError } = await query;
    
    if (submissionsError) {
      console.error('Error fetching submissions data:', submissionsError);
      return { submissions: [], error: 'Failed to fetch submission journey data' };
    }

    console.log(`Retrieved ${submissions?.length || 0} submissions for display`);
    
    return { 
      submissions: submissions || [],
      error: null
    };
    
  } catch (err) {
    console.error('Error in fetchSubmissionJourneyData:', err);
    return { 
      submissions: [],
      error: 'Failed to analyze submission journey data'
    };
  }
};
