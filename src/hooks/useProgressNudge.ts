import { useState, useEffect } from 'react';
import { useLocalProgress } from './useLocalProgress';
import { useToast } from '@/hooks/use-toast';
import { ProgressNudgeState, MilestoneType } from '@/types/progressNudge';
import { createProgressNudgeMessages } from '@/utils/progressNudgeMessages';
import { hasCompletedDailyCalibration, getCurrentStreak, shouldShowProgressNudges } from '@/utils/progressNudgeUtils';
import { checkMilestoneForScore } from '@/utils/progressNudgeMilestones';

export const useProgressNudge = () => {
  const { stats, gameResults } = useLocalProgress();
  const { toast } = useToast();
  
  const [nudgeState, setNudgeState] = useState<ProgressNudgeState>(() => {
    // Load state from localStorage
    const saved = localStorage.getItem('progressNudgeState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      showNavBadge: false,
      showPostScoreCTA: false,
      showStreakToast: false,
      showProgressTour: false,
      hasViewedProgress: false,
      hasCompletedFirstDaily: false,
      hasCompletedSecondDraw: false,
      hasHitThreeDayStreak: false,
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('progressNudgeState', JSON.stringify(nudgeState));
  }, [nudgeState]);

  // Check for nudge triggers based on progress
  useEffect(() => {
    checkNudgeTriggers();
  }, [stats, gameResults]);

  const checkNudgeTriggers = () => {
    const totalGames = stats.totalGames;
    const currentStreak = getCurrentStreak(gameResults);
    const { showFirstDailyToast, showFirstProgressNudgeToast, showStreakToast } = createProgressNudgeMessages();
    
    setNudgeState(prev => {
      let newState = { ...prev };
      
      // First Daily Calibration complete - show toast nudge
      if (hasCompletedDailyCalibration() && !prev.hasCompletedFirstDaily) {
        newState.hasCompletedFirstDaily = true;
        showFirstDailyToast();
      }
      
      // First-time progress nudge: after 2nd or 3rd draw, if hasn't viewed progress yet
      if ((totalGames === 2 || totalGames === 3) && !prev.hasCompletedSecondDraw && !prev.hasViewedProgress) {
        newState.hasCompletedSecondDraw = true;
        newState.showNavBadge = true;
        newState.showPostScoreCTA = true;
        showFirstProgressNudgeToast();
      }
      
      // 3-day streak hit - show streak toast and modal option
      if (currentStreak >= 3 && !prev.hasHitThreeDayStreak && !prev.hasViewedProgress) {
        newState.hasHitThreeDayStreak = true;
        newState.showStreakToast = true;
        showStreakToast();
      }
      
      return newState;
    });
  };


  const markProgressViewed = () => {
    setNudgeState(prev => ({
      ...prev,
      hasViewedProgress: true,
      showNavBadge: false,
      showPostScoreCTA: false,
      showStreakToast: false,
      showProgressTour: true,
    }));
  };

  const completeTour = () => {
    setNudgeState(prev => ({
      ...prev,
      showProgressTour: false,
    }));

    // Award reflection badge
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

    // Unlock progress pulse effect
    localStorage.setItem('progressPulseUnlocked', 'true');
  };

  const dismissNavBadge = () => {
    setNudgeState(prev => ({
      ...prev,
      showNavBadge: false,
    }));
  };

  const dismissPostScoreCTA = () => {
    setNudgeState(prev => ({
      ...prev,
      showPostScoreCTA: false,
    }));
  };

  const resetNudges = () => {
    setNudgeState({
      showNavBadge: false,
      showPostScoreCTA: false,
      showStreakToast: false,
      showProgressTour: false,
      hasViewedProgress: false,
      hasCompletedFirstDaily: false,
      hasCompletedSecondDraw: false,
      hasHitThreeDayStreak: false,
    });
    localStorage.removeItem('progressNudgeState');
  };

  const triggerMilestoneCTA = (milestoneType: MilestoneType) => {
    setNudgeState(prev => ({
      ...prev,
      showPostScoreCTA: true,
      milestoneType
    }));
  };

  return {
    nudgeState,
    markProgressViewed,
    completeTour,
    dismissNavBadge,
    dismissPostScoreCTA,
    resetNudges,
    shouldShowProgressNudges,
    checkMilestoneForScore: (currentScore: number) => checkMilestoneForScore(currentScore, gameResults, stats),
    triggerMilestoneCTA,
  };
};