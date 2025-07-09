import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DailyChallenge {
  id: string;
  date: string;
  difficulty_level: number;
  target_score: number;
}

export interface DailyCompletion {
  id: string;
  user_id: string;
  challenge_date: string;
  score: number;
  attempts: number;
  completed_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  rarity: string;
  xp_reward: number;
}

export interface UserBadge extends Badge {
  earned_at: string;
}

export const useDailyChallenges = () => {
  const [todaysChallenge, setTodaysChallenge] = useState<DailyChallenge | null>(null);
  const [todaysCompletion, setTodaysCompletion] = useState<DailyCompletion | null>(null);
  const [weekChallenges, setWeekChallenges] = useState<DailyChallenge[]>([]);
  const [weekCompletions, setWeekCompletions] = useState<DailyCompletion[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadTodaysChallenge = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data: challenge, error } = await supabase
        .from('daily_challenges')
        .select('*')
        .eq('date', today)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!challenge) {
        // Generate today's challenge if it doesn't exist
        const { data: newChallenge } = await supabase.rpc('generate_daily_challenge', {
          target_date: today
        });
        
        if (newChallenge) {
          const { data: generatedChallenge } = await supabase
            .from('daily_challenges')
            .select('*')
            .eq('date', today)
            .single();
          
          setTodaysChallenge(generatedChallenge);
        }
      } else {
        setTodaysChallenge(challenge);
      }
    } catch (error) {
      console.error('Error loading today\'s challenge:', error);
    }
  };

  const loadTodaysCompletion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];
      
      const { data: completion } = await supabase
        .from('daily_completions')
        .select('*')
        .eq('user_id', user.id)
        .eq('challenge_date', today)
        .maybeSingle();

      setTodaysCompletion(completion);
    } catch (error) {
      console.error('Error loading today\'s completion:', error);
    }
  };

  const loadWeekData = async () => {
    try {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 6);
      const endOfWeek = new Date();
      
      // Load week's challenges
      const { data: challenges } = await supabase
        .from('daily_challenges')
        .select('*')
        .gte('date', startOfWeek.toISOString().split('T')[0])
        .lte('date', endOfWeek.toISOString().split('T')[0])
        .order('date', { ascending: true });

      setWeekChallenges(challenges || []);

      // Load user's completions for the week
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: completions } = await supabase
          .from('daily_completions')
          .select('*')
          .eq('user_id', user.id)
          .gte('challenge_date', startOfWeek.toISOString().split('T')[0])
          .lte('challenge_date', endOfWeek.toISOString().split('T')[0])
          .order('challenge_date', { ascending: true });

        setWeekCompletions(completions || []);
      }
    } catch (error) {
      console.error('Error loading week data:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('current_streak, longest_streak')
        .eq('id', user.id)
        .single();

      if (profile) {
        setCurrentStreak(profile.current_streak || 0);
        setLongestStreak(profile.longest_streak || 0);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadBadges = async () => {
    try {
      // Load all available badges
      const { data: allBadges } = await supabase
        .from('badges')
        .select('*')
        .order('rarity', { ascending: true });

      setBadges(allBadges || []);

      // Load user's earned badges
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: earnedBadges } = await supabase
          .from('user_badges')
          .select(`
            earned_at,
            badges (*)
          `)
          .eq('user_id', user.id)
          .order('earned_at', { ascending: false });

        const formattedBadges = earnedBadges?.map(ub => ({
          ...ub.badges,
          earned_at: ub.earned_at
        })) || [];

        setUserBadges(formattedBadges as UserBadge[]);
      }
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const completeDailyChallenge = async (score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const today = new Date().toISOString().split('T')[0];

      // Record the completion
      const { data: completion, error } = await supabase
        .from('daily_completions')
        .upsert({
          user_id: user.id,
          challenge_date: today,
          score: score,
          attempts: todaysCompletion ? todaysCompletion.attempts + 1 : 1
        })
        .select()
        .single();

      if (error) throw error;

      setTodaysCompletion(completion);

      // Update streak and check for badges
      await updateStreak();
      await checkAndAwardBadges(score);

      return completion;
    } catch (error) {
      console.error('Error completing daily challenge:', error);
      toast({
        title: "Error",
        description: "Failed to record challenge completion",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Calculate current streak
      const { data: recentCompletions } = await supabase
        .from('daily_completions')
        .select('challenge_date')
        .eq('user_id', user.id)
        .order('challenge_date', { ascending: false })
        .limit(100);

      let streak = 0;
      const today = new Date();
      
      if (recentCompletions) {
        for (let i = 0; i < recentCompletions.length; i++) {
          const completionDate = new Date(recentCompletions[i].challenge_date);
          const daysDiff = Math.floor((today.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === i) {
            streak++;
          } else {
            break;
          }
        }
      }

      // Update profile with new streak
      const { error } = await supabase
        .from('profiles')
        .update({
          current_streak: streak,
          longest_streak: Math.max(streak, longestStreak),
          total_daily_completions: recentCompletions?.length || 0
        })
        .eq('id', user.id);

      if (!error) {
        setCurrentStreak(streak);
        setLongestStreak(Math.max(streak, longestStreak));
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const checkAndAwardBadges = async (score: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newBadges: string[] = [];

      // Check score-based badges
      for (const badge of badges) {
        if (badge.requirement_type === 'score' && score >= badge.requirement_value) {
          const hasEarned = userBadges.some(ub => ub.id === badge.id);
          if (!hasEarned) {
            await awardBadge(badge.id);
            newBadges.push(badge.name);
          }
        }
      }

      // Check completion-based badges
      const totalCompletions = weekCompletions.length + (todaysCompletion ? 0 : 1);
      for (const badge of badges) {
        if (badge.requirement_type === 'completion' && totalCompletions >= badge.requirement_value) {
          const hasEarned = userBadges.some(ub => ub.id === badge.id);
          if (!hasEarned) {
            await awardBadge(badge.id);
            newBadges.push(badge.name);
          }
        }
      }

      // Check streak-based badges
      for (const badge of badges) {
        if (badge.requirement_type === 'streak' && currentStreak >= badge.requirement_value) {
          const hasEarned = userBadges.some(ub => ub.id === badge.id);
          if (!hasEarned) {
            await awardBadge(badge.id);
            newBadges.push(badge.name);
          }
        }
      }

      // Show badge notifications
      if (newBadges.length > 0) {
        toast({
          title: "🏆 Badge Earned!",
          description: `You earned: ${newBadges.join(', ')}`,
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const awardBadge = async (badgeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId
        });

      // Reload badges
      await loadBadges();
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        loadTodaysChallenge(),
        loadTodaysCompletion(),
        loadWeekData(),
        loadUserStats(),
        loadBadges()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    todaysChallenge,
    todaysCompletion,
    weekChallenges,
    weekCompletions,
    currentStreak,
    longestStreak,
    badges,
    userBadges,
    isLoading,
    completeDailyChallenge,
    refreshData: () => {
      loadTodaysChallenge();
      loadTodaysCompletion();
      loadWeekData();
      loadUserStats();
      loadBadges();
    }
  };
};