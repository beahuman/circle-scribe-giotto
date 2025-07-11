import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useToneNotificationSettings = () => {
  const [toneBasedNotifications, setToneBasedNotifications] = useState(() => {
    const saved = localStorage.getItem('toneBasedNotifications');
    return saved !== null ? saved === 'true' : false;
  });
  
  const [dailyToneReminders, setDailyToneReminders] = useState(() => {
    const saved = localStorage.getItem('dailyToneReminders');
    return saved !== null ? saved === 'true' : false;
  });
  
  const [streakToneReminders, setStreakToneReminders] = useState(() => {
    const saved = localStorage.getItem('streakToneReminders');
    return saved !== null ? saved === 'true' : false;
  });
  
  const [inactivityToneReminders, setInactivityToneReminders] = useState(() => {
    const saved = localStorage.getItem('inactivityToneReminders');
    return saved !== null ? saved === 'true' : false;
  });
  
  const [doNotDisturbStart, setDoNotDisturbStart] = useState(() => {
    const saved = localStorage.getItem('doNotDisturbStart');
    return saved !== null ? parseInt(saved) : 22; // 10 PM
  });
  
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState(() => {
    const saved = localStorage.getItem('doNotDisturbEnd');
    return saved !== null ? parseInt(saved) : 8; // 8 AM
  });
  
  const { toast } = useToast();

  const handleToneBasedNotificationsToggle = (checked: boolean) => {
    setToneBasedNotifications(checked);
    localStorage.setItem('toneBasedNotifications', String(checked));
    toast({
      title: "Tone-Based Notifications",
      description: checked ? "Giotto's personality notifications enabled" : "Tone-based notifications disabled"
    });
  };

  const handleDailyToneRemindersToggle = (checked: boolean) => {
    setDailyToneReminders(checked);
    localStorage.setItem('dailyToneReminders', String(checked));
    toast({
      title: "Daily Tone Reminders",
      description: checked ? "Personality-driven daily reminders enabled" : "Daily tone reminders disabled"
    });
  };

  const handleStreakToneRemindersToggle = (checked: boolean) => {
    setStreakToneReminders(checked);
    localStorage.setItem('streakToneReminders', String(checked));
    toast({
      title: "Streak Tone Reminders",
      description: checked ? "Tone-aware streak notifications enabled" : "Streak tone reminders disabled"
    });
  };

  const handleInactivityToneRemindersToggle = (checked: boolean) => {
    setInactivityToneReminders(checked);
    localStorage.setItem('inactivityToneReminders', String(checked));
    toast({
      title: "Inactivity Tone Reminders",
      description: checked ? "Gentle tone-based check-ins enabled" : "Inactivity tone reminders disabled"
    });
  };

  const handleDoNotDisturbStartChange = (hour: number) => {
    setDoNotDisturbStart(hour);
    localStorage.setItem('doNotDisturbStart', String(hour));
    toast({
      title: "Do Not Disturb",
      description: `Quiet time starts at ${hour.toString().padStart(2, '0')}:00`
    });
  };

  const handleDoNotDisturbEndChange = (hour: number) => {
    setDoNotDisturbEnd(hour);
    localStorage.setItem('doNotDisturbEnd', String(hour));
    toast({
      title: "Do Not Disturb",
      description: `Quiet time ends at ${hour.toString().padStart(2, '0')}:00`
    });
  };

  return {
    toneBasedNotifications,
    dailyToneReminders,
    streakToneReminders,
    inactivityToneReminders,
    doNotDisturbStart,
    doNotDisturbEnd,
    handleToneBasedNotificationsToggle,
    handleDailyToneRemindersToggle,
    handleStreakToneRemindersToggle,
    handleInactivityToneRemindersToggle,
    handleDoNotDisturbStartChange,
    handleDoNotDisturbEndChange,
  };
};