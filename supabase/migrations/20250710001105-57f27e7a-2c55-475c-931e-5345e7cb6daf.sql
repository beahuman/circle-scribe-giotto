-- Insert 20+ badges with scientific naming and various achievement categories

-- Accuracy Badges
INSERT INTO public.badges (name, description, icon, category, requirement_type, requirement_value, rarity, xp_reward) VALUES
('Precision Initiate', 'Achieve 70% accuracy or higher for the first time', '🎯', 'accuracy', 'single_score', 70, 'common', 10),
('Geometric Apprentice', 'Achieve 80% accuracy or higher', '📐', 'accuracy', 'single_score', 80, 'common', 25),
('Circular Adept', 'Achieve 85% accuracy or higher', '⭕', 'accuracy', 'single_score', 85, 'uncommon', 50),
('Angular Virtuoso', 'Achieve 90% accuracy or higher', '🔵', 'accuracy', 'single_score', 90, 'rare', 100),
('Geometric Perfectionist', 'Achieve 95% accuracy or higher', '💎', 'accuracy', 'single_score', 95, 'epic', 200),
('Euclidean Master', 'Achieve 98% accuracy or higher', '✨', 'accuracy', 'single_score', 98, 'legendary', 500),

-- Streak Badges
('Consistency Scholar', 'Complete daily challenges for 3 consecutive days', '📚', 'streak', 'daily_streak', 3, 'common', 30),
('Habit Architect', 'Complete daily challenges for 7 consecutive days', '🏗️', 'streak', 'daily_streak', 7, 'uncommon', 75),
('Routine Scientist', 'Complete daily challenges for 14 consecutive days', '🔬', 'streak', 'daily_streak', 14, 'rare', 150),
('Dedication Researcher', 'Complete daily challenges for 30 consecutive days', '🧪', 'streak', 'daily_streak', 30, 'epic', 300),
('Persistence Engineer', 'Complete daily challenges for 60 consecutive days', '⚡', 'streak', 'daily_streak', 60, 'legendary', 600),
('Neural Optimizer', 'Complete daily challenges for 100 consecutive days', '🧠', 'streak', 'daily_streak', 100, 'mythic', 1000),

-- Improvement Badges
('Progressive Learner', 'Improve your best score by 10 points', '📈', 'improvement', 'score_improvement', 10, 'common', 20),
('Adaptive Analyst', 'Improve your best score by 20 points', '🔄', 'improvement', 'score_improvement', 20, 'uncommon', 40),
('Evolution Expert', 'Improve your best score by 30 points', '🌱', 'improvement', 'score_improvement', 30, 'rare', 80),
('Transformation Theorist', 'Improve your best score by 40 points', '🔥', 'improvement', 'score_improvement', 40, 'epic', 160),

-- Volume Badges
('Practice Pioneer', 'Complete 10 total attempts', '🚀', 'volume', 'total_attempts', 10, 'common', 15),
('Session Scientist', 'Complete 50 total attempts', '⚗️', 'volume', 'total_attempts', 50, 'uncommon', 60),
('Repetition Researcher', 'Complete 100 total attempts', '🔁', 'volume', 'total_attempts', 100, 'rare', 120),
('Endurance Engineer', 'Complete 250 total attempts', '💪', 'volume', 'total_attempts', 250, 'epic', 250),
('Marathon Mathematician', 'Complete 500 total attempts', '🏃', 'volume', 'total_attempts', 500, 'legendary', 500),

-- Special Achievement Badges
('First Contact', 'Complete your very first circle attempt', '👋', 'milestone', 'first_attempt', 1, 'common', 5),
('Daily Dedication', 'Complete your first daily challenge', '📅', 'milestone', 'first_daily', 1, 'common', 15),
('Perfectionist Protocol', 'Achieve 100% accuracy (perfect circle)', '💯', 'special', 'perfect_score', 100, 'mythic', 1000),
('Speed Demon', 'Complete a circle in under 2 seconds with 85%+ accuracy', '⚡', 'special', 'speed_accuracy', 85, 'rare', 150),
('Night Owl Researcher', 'Complete challenges between 10 PM and 6 AM', '🦉', 'special', 'night_completion', 1, 'uncommon', 50),
('Early Bird Scientist', 'Complete challenges between 5 AM and 8 AM', '🐦', 'special', 'morning_completion', 1, 'uncommon', 50);