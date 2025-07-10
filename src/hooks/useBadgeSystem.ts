import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

type Badge = Tables<'badges'>;
type UserBadge = Tables<'user_badges'>;

interface BadgeProgress {
  badge: Badge;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

interface BadgeCheckContext {
  score: number;
  streak: number;
  totalAttempts: number;
  previousBestScore: number;
  isFirstAttempt: boolean;
  isFirstDaily: boolean;
  completionTime: number;
  isNightTime: boolean;
  isMorningTime: boolean;
}

export const useBadgeSystem = () => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadBadges();
    loadUserBadges();
  }, []);

  const loadBadges = async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('rarity', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  };

  const loadUserBadges = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_badges')
        .select('*, badges(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      setUserBadges(data || []);
    } catch (error) {
      console.error('Error loading user badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndAwardBadges = async (context: BadgeCheckContext) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const newlyEarnedBadges: Badge[] = [];

    for (const badge of badges) {
      // Skip if user already has this badge
      if (userBadges.some(ub => ub.badge_id === badge.id)) continue;

      let shouldAward = false;

      switch (badge.requirement_type) {
        case 'single_score':
          shouldAward = context.score >= (badge.requirement_value || 0);
          break;

        case 'daily_streak':
          shouldAward = context.streak >= (badge.requirement_value || 0);
          break;

        case 'score_improvement':
          const improvement = context.score - context.previousBestScore;
          shouldAward = improvement >= (badge.requirement_value || 0);
          break;

        case 'total_attempts':
          shouldAward = context.totalAttempts >= (badge.requirement_value || 0);
          break;

        case 'first_attempt':
          shouldAward = context.isFirstAttempt;
          break;

        case 'first_daily':
          shouldAward = context.isFirstDaily;
          break;

        case 'perfect_score':
          shouldAward = context.score === 100;
          break;

        case 'speed_accuracy':
          shouldAward = context.completionTime < 2 && context.score >= 85;
          break;

        case 'night_completion':
          shouldAward = context.isNightTime;
          break;

        case 'morning_completion':
          shouldAward = context.isMorningTime;
          break;
      }

      if (shouldAward) {
        try {
          const { error } = await supabase
            .from('user_badges')
            .insert({
              user_id: user.id,
              badge_id: badge.id
            });

          if (!error) {
            newlyEarnedBadges.push(badge);
            showBadgeNotification(badge);
          }
        } catch (error) {
          console.error('Error awarding badge:', error);
        }
      }
    }

    if (newlyEarnedBadges.length > 0) {
      await loadUserBadges();
    }

    return newlyEarnedBadges;
  };

  const showBadgeNotification = (badge: Badge) => {
    const rarityColors = {
      common: '🔶',
      uncommon: '🟢',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟡',
      mythic: '⭐'
    };

    toast({
      title: `${rarityColors[badge.rarity as keyof typeof rarityColors]} Badge Unlocked!`,
      description: `${badge.icon} ${badge.name} - ${badge.description}`,
      duration: 5000,
    });
  };

  const getBadgeProgress = (): BadgeProgress[] => {
    return badges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badge_id === badge.id);
      
      return {
        badge,
        progress: userBadge ? 100 : 0, // Simplified - could be enhanced with partial progress
        unlocked: !!userBadge,
        unlockedAt: userBadge?.earned_at
      };
    });
  };

  const shareBadge = async (badge: Badge) => {
    const shareText = `🎯 Just unlocked "${badge.name}" in Giotto! ${badge.icon}\n\n${badge.description}\n\nTrain your brain with perfect circles!`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Badge Unlocked: ${badge.name}`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard!",
          description: "Share your achievement on social media",
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

  return {
    badges,
    userBadges,
    loading,
    checkAndAwardBadges,
    getBadgeProgress,
    shareBadge,
    loadUserBadges
  };
};