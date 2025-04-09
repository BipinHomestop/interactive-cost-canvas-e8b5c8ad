
export interface SubmissionData {
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

export interface StepCompletionData {
  name: string;
  started: number;
  completed: number;
  completionRate: number;
  avgTimeToComplete: string;
}

export interface SubmissionJourneyResult {
  journeyData: SubmissionData;
  stepCompletionData: StepCompletionData[];
  isJourneyLoading: boolean;
  error: string | null;
}
