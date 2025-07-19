import { useToast } from '@/hooks/use-toast';

export const useBadgeManager = () => {
  const { toast } = useToast();

  const awardReflectionBadge = () => {
    const existingBadges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    if (!existingBadges.includes('reflection')) {
      const newBadges = [...existingBadges, 'reflection'];
      localStorage.setItem('unlockedBadges', JSON.stringify(newBadges));
      
      toast({
        title: "Badge Unlocked! 🏆",
        description: "Reflection - You've discovered your growth tracking",
        duration: 4000,
      });
    }
  };

  const unlockProgressPulse = () => {
    localStorage.setItem('progressPulseUnlocked', 'true');
  };

  return {
    awardReflectionBadge,
    unlockProgressPulse
  };
};