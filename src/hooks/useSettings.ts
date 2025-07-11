import { useBasicSettings } from './useBasicSettings';
import { useGameSettings } from './useGameSettings';
import { useDailyReturnSettings } from './useDailyReturnSettings';
import { useToneNotificationSettings } from './useToneNotificationSettings';

export const useSettings = () => {
  const basicSettings = useBasicSettings();
  const gameSettings = useGameSettings();
  const dailyReturnSettings = useDailyReturnSettings();
  const toneNotificationSettings = useToneNotificationSettings();

  const updateSettings = (newSettings: { [key: string]: any }) => {
    Object.entries(newSettings).forEach(([key, value]) => {
      localStorage.setItem(key, String(value));
      if (key === 'feedbackTone') {
        // Handle feedbackTone setting
      }
    });
  };

  const settings = {
    feedbackTone: (localStorage.getItem('feedbackTone') as 'playful' | 'calm' | 'formal' | 'sarcastic') || 'playful',
    showSubmetrics: gameSettings.showSubmetrics,
    difficultyLevel: gameSettings.difficultyLevel,
    displayDuration: gameSettings.displayDuration,
    penaltyModeEnabled: gameSettings.penaltyModeEnabled,
    showGhostCircle: gameSettings.showGhostCircle,
    mirrorOffsetEnabled: gameSettings.mirrorOffsetEnabled,
    adaptiveScoreScreen: gameSettings.adaptiveScoreScreen,
    ghostTrailOverlay: gameSettings.ghostTrailOverlay,
    dailyNotifications: dailyReturnSettings.dailyNotifications,
    streakMilestoneNotifications: dailyReturnSettings.streakMilestoneNotifications,
    dailyRewards: dailyReturnSettings.dailyRewards,
    habitCues: dailyReturnSettings.habitCues,
    reminderTime: dailyReturnSettings.reminderTime,
    toneBasedNotifications: toneNotificationSettings.toneBasedNotifications,
    dailyToneReminders: toneNotificationSettings.dailyToneReminders,
    streakToneReminders: toneNotificationSettings.streakToneReminders,
    inactivityToneReminders: toneNotificationSettings.inactivityToneReminders,
    doNotDisturbStart: toneNotificationSettings.doNotDisturbStart,
    doNotDisturbEnd: toneNotificationSettings.doNotDisturbEnd
  };

  return {
    // Basic settings
    ...basicSettings,
    
    // Game settings
    ...gameSettings,
    
    // Daily return settings
    ...dailyReturnSettings,
    
    // Tone notification settings
    ...toneNotificationSettings,
    
    // Combined settings object and utilities
    settings,
    updateSettings,
  };
};
