import { useState, useEffect } from 'react';
import { useLocalProgress } from './useLocalProgress';
import { useBadgeManager } from './useBadgeManager';
import { useToast } from '@/hooks/use-toast';
import { ProgressNudgeState, MilestoneType } from '@/types/progressNudge';
import { createProgressNudgeMessages } from '@/utils/progressNudgeMessages';
import { hasCompletedDailyCalibration, getCurrentStreak, shouldShowProgressNudges } from '@/utils/progressNudgeUtils';
import { checkMilestoneForScore } from '@/utils/progressNudgeMilestones';
import { loadNudgeState, saveNudgeState, clearNudgeState, createDefaultNudgeState } from '@/utils/progressNudgeStorage';

export const useProgressNudge = () => {
  const { stats, gameResults } = useLocalProgress();
  const { awardReflectionBadge, unlockProgressPulse } = useBadgeManager();
  const { toast } = useToast();
  
  const [nudgeState, setNudgeState] = useState<ProgressNudgeState>(loadNudgeState);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveNudgeState(nudgeState);
  }, [nudgeState]);

  // Check for nudge triggers based on progress
  useEffect(() => {
    checkNudgeTriggers();
  }, [stats, gameResults]);

  const checkNudgeTriggers = () => {
    const totalGames = stats.totalGames;
    const currentStreak = getCurrentStreak(gameResults);
    const { showFirstDailyToast, showFirstProgressNudgeToast, showStreakToast } = createProgressNudgeMessages(toast);
    
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

    awardReflectionBadge();
    unlockProgressPulse();
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
    setNudgeState(createDefaultNudgeState());
    clearNudgeState();
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