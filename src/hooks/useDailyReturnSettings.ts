import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useDailyReturnSettings = () => {
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

  return {
    dailyNotifications,
    streakMilestoneNotifications,
    dailyRewards,
    habitCues,
    reminderTime,
    handleDailyNotificationsToggle,
    handleStreakMilestoneNotificationsToggle,
    handleDailyRewardsToggle,
    handleHabitCuesToggle,
    handleReminderTimeChange,
  };
};