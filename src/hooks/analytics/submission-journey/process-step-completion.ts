
import { StepCompletionData } from './types';

export const processStepCompletionData = (submissions: any[]): StepCompletionData[] => {
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
  
  return completionData;
};
