import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(() => {
    return Number(localStorage.getItem('difficultyLevel')) || 50;
  });
  const [drawingPrecision, setDrawingPrecision] = useState(() => {
    return Number(localStorage.getItem('drawingPrecision')) || 50;
  });
  const [displayDuration, setDisplayDuration] = useState(() => {
    return Number(localStorage.getItem('displayDuration')) || 3;
  });
  const [showGhostCircle, setShowGhostCircle] = useState(() => {
    return localStorage.getItem('showGhostCircle') === 'true';
  });
  const [penaltyModeEnabled, setPenaltyModeEnabled] = useState(() => {
    return localStorage.getItem('penaltyModeEnabled') === 'true';
  });
  const [showSubmetrics, setShowSubmetrics] = useState(() => {
    return localStorage.getItem('showSubmetrics') === 'true';
  });
  
  const [mirrorOffsetEnabled, setMirrorOffsetEnabled] = useState(() => {
    return localStorage.getItem('mirrorOffsetEnabled') === 'true';
  });
  
  const [adaptiveScoreScreen, setAdaptiveScoreScreen] = useState(() => {
    const saved = localStorage.getItem('adaptiveScoreScreen');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const [ghostTrailOverlay, setGhostTrailOverlay] = useState(() => {
    const saved = localStorage.getItem('ghostTrailOverlay');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const [dailyNotifications, setDailyNotifications] = useState(() => {
    const saved = localStorage.getItem('dailyNotifications');
    return saved !== null ? saved === 'true' : false; // Default to false
  });
  
  const [streakMilestoneNotifications, setStreakMilestoneNotifications] = useState(() => {
    const saved = localStorage.getItem('streakMilestoneNotifications');
    return saved !== null ? saved === 'true' : false; // Default to false
  });
  
  const [dailyRewards, setDailyRewards] = useState(() => {
    const saved = localStorage.getItem('dailyRewards');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const [habitCues, setHabitCues] = useState(() => {
    const saved = localStorage.getItem('habitCues');
    return saved !== null ? saved === 'true' : true; // Default to true
  });
  
  const [reminderTime, setReminderTime] = useState(() => {
    return localStorage.getItem('reminderTime') || 'evening';
  });
  
  const { toast } = useToast();

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    toast({
      title: "Notification Settings",
      description: checked ? "Notifications enabled" : "Notifications disabled"
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast({
      title: "Appearance",
      description: checked ? "Dark mode enabled" : "Light mode enabled"
    });
  };

  const handleDifficultyChange = (value: number[]) => {
    const newValue = value[0];
    setDifficultyLevel(newValue);
    localStorage.setItem('difficultyLevel', String(newValue));
    toast({
      title: "Difficulty Updated",
      description: `Difficulty level set to ${newValue}%`
    });
  };

  const handlePrecisionChange = (value: number[]) => {
    const newValue = value[0];
    setDrawingPrecision(newValue);
    localStorage.setItem('drawingPrecision', String(newValue));
    toast({
      title: "Drawing Precision Updated",
      description: `Drawing precision set to ${newValue}%`
    });
  };

  const handleDurationChange = (value: number[]) => {
    const newValue = value[0];
    setDisplayDuration(newValue);
    localStorage.setItem('displayDuration', String(newValue));
    toast({
      title: "Display Duration Updated",
      description: `Circle will display for ${newValue} seconds`
    });
  };
  
  const handleGhostCircleToggle = (checked: boolean) => {
    setShowGhostCircle(checked);
    localStorage.setItem('showGhostCircle', String(checked));
    toast({
      title: "Ghost Circle",
      description: checked ? "Ghost circle enabled" : "Ghost circle disabled"
    });
  };

  const handlePenaltyModeToggle = (checked: boolean) => {
    setPenaltyModeEnabled(checked);
    localStorage.setItem('penaltyModeEnabled', String(checked));
    toast({
      title: "Penalty Mode",
      description: checked ? "Penalty mode enabled - good luck!" : "Penalty mode disabled"
    });
  };

  const handleSubmetricsToggle = (checked: boolean) => {
    setShowSubmetrics(checked);
    localStorage.setItem('showSubmetrics', String(checked));
    toast({
      title: "Visual Analytics",
      description: checked ? "Submetrics overlay enabled" : "Submetrics overlay disabled"
    });
  };

  const handleMirrorOffsetToggle = (checked: boolean) => {
    setMirrorOffsetEnabled(checked);
    localStorage.setItem('mirrorOffsetEnabled', String(checked));
    toast({
      title: "Mirror-Offset Mode",
      description: checked ? "Mirror-offset mode enabled" : "Mirror-offset mode disabled"
    });
  };

  const handleAdaptiveScoreScreenToggle = (checked: boolean) => {
    setAdaptiveScoreScreen(checked);
    localStorage.setItem('adaptiveScoreScreen', String(checked));
    toast({
      title: "Adaptive Score Screen",
      description: checked ? "Dynamic score screen enabled" : "Traditional score screen enabled"
    });
  };

  const handleGhostTrailOverlayToggle = (checked: boolean) => {
    setGhostTrailOverlay(checked);
    localStorage.setItem('ghostTrailOverlay', String(checked));
    toast({
      title: "Ghost Trail Overlay",
      description: checked ? "Ghost trail comparison enabled" : "Ghost trail comparison disabled"
    });
  };

  const updateSettings = (newSettings: { [key: string]: any }) => {
    Object.entries(newSettings).forEach(([key, value]) => {
      localStorage.setItem(key, String(value));
      if (key === 'feedbackTone') {
        // Handle feedbackTone setting
      }
    });
  };

  const handleDailyNotificationsToggle = (checked: boolean) => {
    setDailyNotifications(checked);
    localStorage.setItem('dailyNotifications', String(checked));
    toast({
      title: "Daily Notifications",
      description: checked ? "Daily draw reminders enabled" : "Daily draw reminders disabled"
    });
  };

  const handleStreakMilestoneNotificationsToggle = (checked: boolean) => {
    setStreakMilestoneNotifications(checked);
    localStorage.setItem('streakMilestoneNotifications', String(checked));
    toast({
      title: "Streak Milestone Notifications",
      description: checked ? "Streak milestone notifications enabled" : "Streak milestone notifications disabled"
    });
  };

  const handleDailyRewardsToggle = (checked: boolean) => {
    setDailyRewards(checked);
    localStorage.setItem('dailyRewards', String(checked));
    toast({
      title: "Daily Rewards",
      description: checked ? "Daily completion rewards enabled" : "Daily completion rewards disabled"
    });
  };

  const handleHabitCuesToggle = (checked: boolean) => {
    setHabitCues(checked);
    localStorage.setItem('habitCues', String(checked));
    toast({
      title: "Habit Cues",
      description: checked ? "Gentle daily reminders enabled" : "Gentle daily reminders disabled"
    });
  };

  const handleReminderTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem('reminderTime', time);
    toast({
      title: "Reminder Time",
      description: `Daily reminder time set to ${time}`
    });
  };

  const settings = {
    feedbackTone: (localStorage.getItem('feedbackTone') as 'playful' | 'calm' | 'formal' | 'sarcastic') || 'playful',
    showSubmetrics,
    difficultyLevel,
    displayDuration,
    penaltyModeEnabled,
    showGhostCircle,
    mirrorOffsetEnabled,
    adaptiveScoreScreen,
    ghostTrailOverlay,
    dailyNotifications,
    streakMilestoneNotifications,
    dailyRewards,
    habitCues,
    reminderTime
  };

  return {
    notifications,
    darkMode,
    difficultyLevel,
    drawingPrecision,
    displayDuration,
    showGhostCircle,
    penaltyModeEnabled,
    showSubmetrics,
    mirrorOffsetEnabled,
    adaptiveScoreScreen,
    ghostTrailOverlay,
    dailyNotifications,
    streakMilestoneNotifications,
    dailyRewards,
    habitCues,
    reminderTime,
    settings,
    updateSettings,
    handleNotificationToggle,
    handleDarkModeToggle,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
    handleGhostCircleToggle,
    handlePenaltyModeToggle,
    handleSubmetricsToggle,
    handleMirrorOffsetToggle,
    handleAdaptiveScoreScreenToggle,
    handleGhostTrailOverlayToggle,
    handleDailyNotificationsToggle,
    handleStreakMilestoneNotificationsToggle,
    handleDailyRewardsToggle,
    handleHabitCuesToggle,
    handleReminderTimeChange,
  };
};
