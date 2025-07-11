import { useState, useEffect } from 'react';
import { useLocalProgress } from './useLocalProgress';
import { useToast } from '@/hooks/use-toast';

export interface ProgressNudgeState {
  showNavBadge: boolean;
  showPostScoreCTA: boolean;
  showStreakToast: boolean;
  showProgressTour: boolean;
  hasViewedProgress: boolean;
  hasCompletedFirstDaily: boolean;
  hasCompletedSecondDraw: boolean;
  hasHitThreeDayStreak: boolean;
  milestoneType?: 'new_best' | 'streak_broken' | 'score_improvement' | 'unlock_milestone' | null;
}

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
    const currentStreak = getCurrentStreak();
    
    setNudgeState(prev => {
      let newState = { ...prev };
      
      // First Daily Calibration complete - show toast nudge
      if (hasCompletedDailyCalibration() && !prev.hasCompletedFirstDaily) {
        newState.hasCompletedFirstDaily = true;
        showFirstDailyToast();
      }
      
      // Second Practice Mode draw - show nav badge
      if (totalGames >= 2 && !prev.hasCompletedSecondDraw && !prev.hasViewedProgress) {
        newState.hasCompletedSecondDraw = true;
        newState.showNavBadge = true;
        newState.showPostScoreCTA = true;
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

  const hasCompletedDailyCalibration = (): boolean => {
    // Check if user has completed at least one daily calibration
    // This would need to be integrated with the daily calibration system
    const dailyCompletions = localStorage.getItem('dailyCalibrationCompleted');
    return dailyCompletions === 'true';
  };

  const getCurrentStreak = (): number => {
    // Calculate current streak based on recent game results
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    const dayBeforeYesterday = new Date(Date.now() - 48 * 60 * 60 * 1000).toDateString();
    
    const recentDays = gameResults
      .map(result => new Date(result.timestamp).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index);
    
    let streak = 0;
    if (recentDays.includes(today)) streak = 1;
    if (recentDays.includes(yesterday)) streak = Math.max(streak, 2);
    if (recentDays.includes(dayBeforeYesterday)) streak = Math.max(streak, 3);
    
    return streak;
  };

  const showFirstDailyToast = () => {
    toast({
      title: "Nice start! 🎯",
      description: "Your journey is being tracked. See your progress →",
      duration: 4000,
    });
  };

  const showStreakToast = () => {
    toast({
      title: "3 Days. That's a pattern. 🔥",
      description: "See what you're building in your progress page",
      duration: 5000,
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

  const shouldShowProgressNudges = (): boolean => {
    const setting = localStorage.getItem('showProgressNudges');
    return setting !== 'false'; // Default to true
  };

  // Check for milestone-based progress CTA triggers
  const checkMilestoneForScore = (currentScore: number): 'new_best' | 'score_improvement' | 'streak_broken' | null => {
    if (gameResults.length === 0) return null;
    
    // Check for new best score
    if (currentScore > stats.bestScore) {
      return 'new_best';
    }
    
    // Check for score improvement (better than last attempt)
    const lastScore = gameResults[0]?.score || 0;
    if (currentScore > lastScore && currentScore >= 70) { // Show only for decent scores
      return 'score_improvement';
    }
    
    // Check for streak broken (previous games had better scores)
    const recentScores = gameResults.slice(0, 3).map(r => r.score);
    const averageRecent = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
    if (currentScore < averageRecent * 0.8 && averageRecent > 60) { // Significant drop
      return 'streak_broken';
    }
    
    return null;
  };

  const triggerMilestoneCTA = (milestoneType: 'new_best' | 'score_improvement' | 'streak_broken' | 'unlock_milestone') => {
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
    checkMilestoneForScore,
    triggerMilestoneCTA,
  };
};