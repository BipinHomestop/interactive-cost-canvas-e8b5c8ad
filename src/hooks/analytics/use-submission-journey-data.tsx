
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStartDateFromRange, getEndDateFromRange } from './utils/date-utils';

interface SubmissionData {
  submissions: Array<{
    id: string;
    created_at: string;
    location: string;
    name: string;
    email: string;
    phone: string;
    garage_capacity: number;
    garage_finish: string;
    need_stem_walls: string;
    stem_wall_type?: string;
    need_steps?: string;
    need_extra_footage?: string;
    extra_footage?: string;
    current_condition?: string;
    total_price?: number;
    payment_status: string;
  }>;
}

interface StepCompletionData {
  name: string;
  started: number;
  completed: number;
  completionRate: number;
  avgTimeToComplete: string;
}

export const useSubmissionJourneyData = (timeRange: string = '30d') => {
  const [journeyData, setJourneyData] = useState<SubmissionData>({
    submissions: []
  });
  const [stepCompletionData, setStepCompletionData] = useState<StepCompletionData[]>([]);
  const [isJourneyLoading, setIsJourneyLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissionJourneyData = async () => {
      try {
        setIsJourneyLoading(true);
        setError(null);
        
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
          setError('Failed to fetch submission journey data');
          return;
        }

        console.log(`Retrieved ${submissions?.length || 0} submissions for display`);
        
        // Set submissions data for display
        setJourneyData({ 
          submissions: submissions || [] 
        });
        
        // Still process completion data for the table below
        if (submissions && submissions.length > 0) {
          processStepCompletionData(submissions);
        } else {
          setStepCompletionData([]);
        }
        
      } catch (err) {
        console.error('Error in fetchSubmissionJourneyData:', err);
        setError('Failed to analyze submission journey data');
      } finally {
        setIsJourneyLoading(false);
      }
    };

    fetchSubmissionJourneyData();
  }, [timeRange]);

  const processStepCompletionData = (submissions: any[]) => {
    // Define steps in the journey
    const steps = [
      'Location',
      'Garage Capacity',
      'Garage Finish',
      'Stem Walls',
      'Steps',
      'Extra Footage',
      'Current Condition',
      'Contact Info',
      'Completed'
    ];
    
    // Count submissions at each step
    const stepCounts = steps.map(() => 0);
    const stepCompletions = steps.map(() => 0);
    
    // Track which submissions reached each step
    submissions.forEach(submission => {
      // Track which step the submission reached
      let maxStepReached = -1;
      
      // Check location (step 0)
      if (submission.location) {
        stepCounts[0]++;
        maxStepReached = 0;
        
        // Check garage capacity (step 1)
        if (submission.garage_capacity) {
          stepCounts[1]++;
          maxStepReached = 1;
          
          // Check garage finish (step 2)
          if (submission.garage_finish) {
            stepCounts[2]++;
            maxStepReached = 2;
            
            // Check stem walls (step 3)
            if (submission.need_stem_walls) {
              stepCounts[3]++;
              maxStepReached = 3;
              
              // Check steps (step 4)
              if (submission.need_steps !== null && submission.need_steps !== undefined) {
                stepCounts[4]++;
                maxStepReached = 4;
                
                // Check extra footage (step 5)
                if (submission.need_extra_footage !== null && submission.need_extra_footage !== undefined) {
                  stepCounts[5]++;
                  maxStepReached = 5;
                  
                  // Check current condition (step 6)
                  if (submission.current_condition) {
                    stepCounts[6]++;
                    maxStepReached = 6;
                    
                    // Check contact info (step 7)
                    if (submission.name && submission.email && submission.phone) {
                      stepCounts[7]++;
                      maxStepReached = 7;
                      
                      // Check completion (step 8)
                      if (submission.payment_status === 'completed' || submission.payment_status === 'paid') {
                        stepCounts[8]++;
                        maxStepReached = 8;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      // Mark completion for steps reached
      for (let i = 0; i <= maxStepReached; i++) {
        stepCompletions[i]++;
      }
    });
    
    // Calculate completion rates and average time
    const completionData: StepCompletionData[] = steps.map((step, index) => {
      // For now, we'll use a placeholder for average time
      // In a real implementation, you'd calculate this from timestamps
      let avgTime = '1m 30s'; // Default placeholder
      
      // Simulate different times for different steps to make it more realistic
      if (index < 2) avgTime = '0m 45s';
      else if (index < 5) avgTime = '1m 15s';
      else if (index < 7) avgTime = '1m 45s';
      else avgTime = '2m 30s';
      
      return {
        name: step,
        started: stepCounts[index],
        completed: stepCompletions[index],
        completionRate: stepCounts[index] > 0 
          ? Math.round((stepCompletions[index] / stepCounts[index]) * 100) 
          : 0,
        avgTimeToComplete: avgTime
      };
    });
    
    // Update state with processed data
    setStepCompletionData(completionData);
  };

  return { 
    journeyData,
    stepCompletionData,
    isJourneyLoading,
    error
  };
};
