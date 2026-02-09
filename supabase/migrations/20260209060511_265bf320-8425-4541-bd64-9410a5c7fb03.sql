-- Create a table to store session tokens for submission ownership verification
CREATE TABLE IF NOT EXISTS public.submission_session_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL,
  token UUID NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_submission 
    FOREIGN KEY (submission_id) 
    REFERENCES public.cost_calculator_submissions(id) 
    ON DELETE CASCADE
);

-- Create index for fast token lookups
CREATE INDEX idx_session_tokens_token ON public.submission_session_tokens(token);
CREATE INDEX idx_session_tokens_submission ON public.submission_session_tokens(submission_id);
CREATE INDEX idx_session_tokens_expires ON public.submission_session_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.submission_session_tokens ENABLE ROW LEVEL SECURITY;

-- No public access - only edge functions with service role can manage tokens
-- This is intentional - the edge function uses the service role key