-- Create daily challenges system

-- Table for available daily challenges
CREATE TABLE public.daily_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  difficulty_level INTEGER NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
  target_score INTEGER NOT NULL DEFAULT 75,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for tracking user daily completions
CREATE TABLE public.daily_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_date DATE NOT NULL,
  score INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, challenge_date)
);

-- Table for available badges
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  requirement_type TEXT NOT NULL, -- 'streak', 'score', 'completion', 'special'
  requirement_value INTEGER,
  requirement_data JSONB,
  rarity TEXT NOT NULL DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
  xp_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for tracking user earned badges
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Add streak tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0,
ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0,
ADD COLUMN total_daily_completions INTEGER NOT NULL DEFAULT 0;

-- Enable RLS on new tables
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_challenges (public read access)
CREATE POLICY "Daily challenges are viewable by everyone" 
ON public.daily_challenges 
FOR SELECT 
USING (true);

-- RLS Policies for daily_completions
CREATE POLICY "Users can view their own daily completions" 
ON public.daily_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily completions" 
ON public.daily_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily completions" 
ON public.daily_completions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for badges (public read access)
CREATE POLICY "Badges are viewable by everyone" 
ON public.badges 
FOR SELECT 
USING (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" 
ON public.user_badges 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own badges" 
ON public.user_badges 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_daily_challenges_updated_at
BEFORE UPDATE ON public.daily_challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_completions_updated_at
BEFORE UPDATE ON public.daily_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial badges
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, rarity, xp_reward) VALUES
('First Steps', 'Complete your first daily challenge', '🎯', 'milestones', 'completion', 1, 'common', 50),
('Consistent Learner', 'Complete daily challenges for 3 days in a row', '🔥', 'streaks', 'streak', 3, 'common', 100),
('Week Warrior', 'Complete daily challenges for 7 days in a row', '⚡', 'streaks', 'streak', 7, 'rare', 250),
('Perfect Month', 'Complete daily challenges for 30 days in a row', '👑', 'streaks', 'streak', 30, 'legendary', 1000),
('Precision Master', 'Score 95% or higher on a daily challenge', '🎯', 'performance', 'score', 95, 'rare', 200),
('Giotto''s Heir', 'Score 98% or higher on a daily challenge', '🎨', 'performance', 'score', 98, 'epic', 500),
('Perfectionist', 'Score 100% on a daily challenge', '💎', 'performance', 'score', 100, 'legendary', 1000),
('Dedication', 'Complete 10 daily challenges', '📈', 'milestones', 'completion', 10, 'common', 150),
('Commitment', 'Complete 50 daily challenges', '🏆', 'milestones', 'completion', 50, 'rare', 500),
('Legend', 'Complete 100 daily challenges', '⭐', 'milestones', 'completion', 100, 'legendary', 1500);

-- Create function to generate daily challenges
CREATE OR REPLACE FUNCTION public.generate_daily_challenge(target_date DATE DEFAULT CURRENT_DATE)
RETURNS UUID AS $$
DECLARE
  challenge_id UUID;
  day_of_year INTEGER;
  difficulty INTEGER;
BEGIN
  -- Calculate difficulty based on day of year (cycles through 1-5)
  day_of_year := EXTRACT(DOY FROM target_date);
  difficulty := ((day_of_year - 1) % 5) + 1;
  
  -- Insert or update daily challenge
  INSERT INTO public.daily_challenges (date, difficulty_level, target_score)
  VALUES (target_date, difficulty, 70 + (difficulty * 5))
  ON CONFLICT (date) 
  DO UPDATE SET 
    difficulty_level = EXCLUDED.difficulty_level,
    target_score = EXCLUDED.target_score,
    updated_at = now()
  RETURNING id INTO challenge_id;
  
  RETURN challenge_id;
END;
$$ LANGUAGE plpgsql;

-- Generate challenges for the next 7 days
SELECT public.generate_daily_challenge(CURRENT_DATE + i) 
FROM generate_series(0, 6) AS i;