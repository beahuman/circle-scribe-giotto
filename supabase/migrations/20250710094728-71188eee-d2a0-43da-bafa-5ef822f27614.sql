-- Create user roles enum and table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create user sessions tracking table
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  page_views INTEGER DEFAULT 1,
  session_date DATE GENERATED ALWAYS AS (session_start::DATE) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_sessions
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_sessions
CREATE POLICY "Users can insert their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.user_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" 
ON public.user_sessions 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create feature usage tracking table
CREATE TABLE public.feature_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  metadata JSONB,
  usage_date DATE GENERATED ALWAYS AS (created_at::DATE) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on feature_usage
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for feature_usage
CREATE POLICY "Users can insert their own feature usage" 
ON public.feature_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all feature usage" 
ON public.feature_usage 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create daily analytics aggregation table
CREATE TABLE public.daily_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  daily_active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  avg_session_duration DECIMAL(10,2) DEFAULT 0,
  total_page_views INTEGER DEFAULT 0,
  game_sessions INTEGER DEFAULT 0,
  challenge_completions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on daily_analytics
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policy for daily_analytics
CREATE POLICY "Admins can view analytics" 
ON public.daily_analytics 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to aggregate daily analytics
CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  dau_count INTEGER;
  new_users_count INTEGER;
  sessions_count INTEGER;
  avg_duration DECIMAL(10,2);
  page_views_count INTEGER;
  game_count INTEGER;
  challenge_count INTEGER;
BEGIN
  -- Calculate daily active users
  SELECT COUNT(DISTINCT user_id) INTO dau_count
  FROM public.user_sessions 
  WHERE session_date = target_date;
  
  -- Calculate new users (profiles created today)
  SELECT COUNT(*) INTO new_users_count
  FROM public.profiles 
  WHERE created_at::DATE = target_date;
  
  -- Calculate total sessions
  SELECT COUNT(*), COALESCE(AVG(duration_minutes), 0), COALESCE(SUM(page_views), 0)
  INTO sessions_count, avg_duration, page_views_count
  FROM public.user_sessions 
  WHERE session_date = target_date;
  
  -- Calculate game sessions and challenge completions
  SELECT 
    COUNT(CASE WHEN feature_name = 'game' AND action_type = 'start' THEN 1 END),
    COUNT(CASE WHEN feature_name = 'daily_challenge' AND action_type = 'complete' THEN 1 END)
  INTO game_count, challenge_count
  FROM public.feature_usage 
  WHERE usage_date = target_date;
  
  -- Insert or update daily analytics
  INSERT INTO public.daily_analytics (
    date, daily_active_users, new_users, total_sessions, 
    avg_session_duration, total_page_views, game_sessions, challenge_completions
  )
  VALUES (
    target_date, dau_count, new_users_count, sessions_count,
    avg_duration, page_views_count, game_count, challenge_count
  )
  ON CONFLICT (date) 
  DO UPDATE SET 
    daily_active_users = EXCLUDED.daily_active_users,
    new_users = EXCLUDED.new_users,
    total_sessions = EXCLUDED.total_sessions,
    avg_session_duration = EXCLUDED.avg_session_duration,
    total_page_views = EXCLUDED.total_page_views,
    game_sessions = EXCLUDED.game_sessions,
    challenge_completions = EXCLUDED.challenge_completions,
    updated_at = now();
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_user_sessions_date ON public.user_sessions(session_date);
CREATE INDEX idx_feature_usage_date ON public.feature_usage(usage_date);
CREATE INDEX idx_user_sessions_user_date ON public.user_sessions(user_id, session_date);
CREATE INDEX idx_feature_usage_feature_action ON public.feature_usage(feature_name, action_type);

-- Add updated_at trigger for daily_analytics
CREATE TRIGGER update_daily_analytics_updated_at
  BEFORE UPDATE ON public.daily_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();