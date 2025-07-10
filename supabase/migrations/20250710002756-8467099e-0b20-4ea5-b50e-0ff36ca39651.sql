-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create premium badges table for exclusive premium badge designs
CREATE TABLE public.premium_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'premium',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER,
  requirement_data JSONB,
  rarity TEXT NOT NULL DEFAULT 'legendary',
  xp_reward INTEGER NOT NULL DEFAULT 100,
  premium_only BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for premium badges
ALTER TABLE public.premium_badges ENABLE ROW LEVEL SECURITY;

-- Premium badges are viewable by everyone but only premium users can earn them
CREATE POLICY "premium_badges_viewable" ON public.premium_badges
FOR SELECT
USING (true);

-- Insert premium badges
INSERT INTO public.premium_badges (name, description, icon, category, requirement_type, requirement_value, rarity, xp_reward) VALUES
('Aurum Perfectionist', 'Achieve 99% accuracy in premium analytics mode', '🥇', 'premium_accuracy', 'accuracy_premium', 99, 'legendary', 200),
('Platinum Streak Master', 'Maintain a 50-day premium streak', '💎', 'premium_streak', 'streak_premium', 50, 'legendary', 250),
('Elite Analyst', 'Complete 100 sessions with premium analytics tracking', '📊', 'premium_analytics', 'sessions_premium', 100, 'epic', 150),
('Minimalist Virtuoso', 'Use 10 different premium themes', '🎨', 'premium_themes', 'themes_used', 10, 'epic', 150),
('Premium Pioneer', 'First week of premium subscription', '🚀', 'premium_milestone', 'subscription_days', 7, 'rare', 100);

-- Add premium columns to existing tables for extended features
ALTER TABLE public.game_scores 
ADD COLUMN premium_analytics JSONB,
ADD COLUMN premium_metadata JSONB;

-- Update updated_at trigger for subscribers
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();