import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { useSubscription } from '@/hooks/useSubscription';

interface RewardedAdState {
  loading: boolean;
  canShowAd: boolean;
  lastAdWatched: number | null;
  dailyAdsWatched: number;
  maxDailyAds: number;
}

export const useRewardedAds = () => {
  const { toast } = useToast();
  const { addXp } = usePlayerProgress();
  const { isPremium } = useSubscription();
  
  const [adState, setAdState] = useState<RewardedAdState>(() => {
    const today = new Date().toDateString();
    const storedState = localStorage.getItem('rewardedAdState');
    const storedDate = localStorage.getItem('rewardedAdDate');
    
    if (storedState && storedDate === today) {
      return JSON.parse(storedState);
    }
    
    return {
      loading: false,
      canShowAd: true,
      lastAdWatched: null,
      dailyAdsWatched: 0,
      maxDailyAds: isPremium ? 3 : 5, // Premium users see fewer ads
    };
  });

  const saveAdState = useCallback((newState: RewardedAdState) => {
    const today = new Date().toDateString();
    localStorage.setItem('rewardedAdState', JSON.stringify(newState));
    localStorage.setItem('rewardedAdDate', today);
    setAdState(newState);
  }, []);

  const canWatchAd = useCallback(() => {
    const now = Date.now();
    const cooldownTime = 3 * 60 * 1000; // 3 minutes between ads
    
    return adState.canShowAd && 
           adState.dailyAdsWatched < adState.maxDailyAds &&
           (!adState.lastAdWatched || now - adState.lastAdWatched > cooldownTime);
  }, [adState]);

  const showRewardedAd = useCallback(async (rewardType: 'xp' | 'calibration' | 'tips'): Promise<boolean> => {
    if (!canWatchAd()) {
      toast({
        title: "Ad Not Available",
        description: "Please wait before watching another ad",
        variant: "destructive",
      });
      return false;
    }

    setAdState(prev => ({ ...prev, loading: true }));

    try {
      // Simulate ad loading and viewing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate ad watching success
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        const now = Date.now();
        const newState = {
          ...adState,
          loading: false,
          lastAdWatched: now,
          dailyAdsWatched: adState.dailyAdsWatched + 1,
        };
        
        saveAdState(newState);
        
        // Grant rewards based on type
        switch (rewardType) {
          case 'xp':
            const bonusXp = 25 + Math.floor(Math.random() * 25); // 25-50 XP
            addXp(bonusXp);
            toast({
              title: "Bonus XP Earned!",
              description: `You earned ${bonusXp} bonus XP! Thanks for watching.`,
            });
            break;
            
          case 'calibration':
            // This would integrate with calibration system
            toast({
              title: "Extra Attempt Unlocked!",
              description: "You earned an extra daily calibration attempt!",
            });
            break;
            
          case 'tips':
            toast({
              title: "Premium Tip Unlocked!",
              description: "You've unlocked exclusive neuroscience insights!",
            });
            break;
        }
        
        return true;
      } else {
        setAdState(prev => ({ ...prev, loading: false }));
        toast({
          title: "Ad Failed to Load",
          description: "Please try again in a moment",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      setAdState(prev => ({ ...prev, loading: false }));
      toast({
        title: "Ad Error",
        description: "Failed to load ad. Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  }, [canWatchAd, adState, saveAdState, addXp, toast]);

  const getRemainingAds = useCallback(() => {
    return adState.maxDailyAds - adState.dailyAdsWatched;
  }, [adState]);

  const getNextAdAvailable = useCallback(() => {
    if (!adState.lastAdWatched) return 0;
    const cooldownTime = 3 * 60 * 1000; // 3 minutes
    const timeUntilNext = (adState.lastAdWatched + cooldownTime) - Date.now();
    return Math.max(0, timeUntilNext);
  }, [adState.lastAdWatched]);

  return {
    canWatchAd: canWatchAd(),
    showRewardedAd,
    loading: adState.loading,
    remainingAds: getRemainingAds(),
    nextAdAvailable: getNextAdAvailable(),
    dailyAdsWatched: adState.dailyAdsWatched,
    maxDailyAds: adState.maxDailyAds,
  };
};