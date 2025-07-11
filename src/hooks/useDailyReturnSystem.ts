import { useState, useEffect } from 'react';
import { useDailyCalibration } from './useDailyCalibration';
import { useToneSystem } from './useToneSystem';
import { useSettings } from './useSettings';
import { useToast } from './use-toast';
import { getStreakMessage } from '@/utils/toneMessages';

interface DailyReturnState {
  hasDrawnToday: boolean;
  streakReward: string | null;
  showCompletionAnimation: boolean;
  nextMilestone: number;
  daysSinceLastDraw: number;
}

export const useDailyReturnSystem = () => {
  const { streak, todayCompleted, canCalibrate } = useDailyCalibration();
  const { selectedTone } = useToneSystem();
  const { settings } = useSettings();
  const { toast } = useToast();
  
  const [returnState, setReturnState] = useState<DailyReturnState>({
    hasDrawnToday: false,
    streakReward: null,
    showCompletionAnimation: false,
    nextMilestone: 3,
    daysSinceLastDraw: 0
  });

  // Calculate next milestone
  const getNextMilestone = (currentStreak: number) => {
    const milestones = [3, 7, 14, 21, 30, 60, 100];
    return milestones.find(m => m > currentStreak) || currentStreak + 30;
  };

  // Get streak reminder message
  const getStreakReminderText = () => {
    if (todayCompleted) {
      return getStreakMessage(selectedTone, streak.current);
    }
    
    if (streak.current === 0) {
      return "Start your drawing journey";
    }
    
    return getStreakMessage(selectedTone, streak.current);
  };

  // Get milestone reward
  const getMilestoneReward = (streakCount: number) => {
    const rewards = {
      3: "New brush style unlocked",
      7: "Blind Draw mode unlocked", 
      14: "Cognitive Flow theme unlocked",
      21: "Advanced insights unlocked",
      30: "Master tier unlocked"
    };
    return rewards[streakCount as keyof typeof rewards];
  };

  // Handle daily completion
  const handleDailyCompletion = (score: number) => {
    const newStreak = streak.current + 1;
    const reward = getMilestoneReward(newStreak);
    
    setReturnState(prev => ({
      ...prev,
      hasDrawnToday: true,
      streakReward: reward || null,
      showCompletionAnimation: true
    }));

    // Show milestone celebration
    if (reward && settings.dailyRewards) {
      setTimeout(() => {
        toast({
          title: `Day ${newStreak} Milestone!`,
          description: reward,
          duration: 4000
        });
      }, 1000);
    }

    // Auto-hide animation after 3 seconds
    setTimeout(() => {
      setReturnState(prev => ({ ...prev, showCompletionAnimation: false }));
    }, 3000);
  };

  // Daily return animation trigger
  const triggerHabitCue = () => {
    if (!todayCompleted && settings.habitCues) {
      // Trigger subtle animation cue
      const event = new CustomEvent('dailyHabitCue');
      window.dispatchEvent(event);
    }
  };

  useEffect(() => {
    setReturnState(prev => ({
      ...prev,
      hasDrawnToday: todayCompleted,
      nextMilestone: getNextMilestone(streak.current)
    }));
  }, [streak.current, todayCompleted]);

  // Trigger habit cue once per day
  useEffect(() => {
    const lastCue = localStorage.getItem('lastHabitCue');
    const today = new Date().toDateString();
    
    if (lastCue !== today && !todayCompleted) {
      setTimeout(triggerHabitCue, 2000); // 2 second delay
      localStorage.setItem('lastHabitCue', today);
    }
  }, [todayCompleted, settings.habitCues]);

  return {
    ...returnState,
    streak,
    canDraw: canCalibrate,
    streakReminderText: getStreakReminderText(),
    progressToNextMilestone: streak.current % (returnState.nextMilestone - streak.current),
    handleDailyCompletion,
    triggerHabitCue
  };
};