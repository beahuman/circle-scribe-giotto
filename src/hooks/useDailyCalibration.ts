import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface DailyEntry {
  date: string;
  accuracy: number;
  completed: boolean;
}

export const useDailyCalibration = () => {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [todayCompleted, setTodayCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadDailyData();
  }, []);

  const loadDailyData = () => {
    const savedData = localStorage.getItem('dailyCalibration');
    const today = new Date().toISOString().split('T')[0];
    
    if (savedData) {
      const entries = JSON.parse(savedData);
      setDailyEntries(entries);
      
      // Check if today is already completed
      const todayEntry = entries.find((entry: DailyEntry) => entry.date === today);
      setTodayCompleted(todayEntry?.completed || false);
    }
  };

  const recordDailyAccuracy = (accuracy: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (todayCompleted) {
      toast({
        title: "Already completed today",
        description: "Come back tomorrow for your next calibration!",
        duration: 3000
      });
      return false;
    }

    const newEntry: DailyEntry = {
      date: today,
      accuracy: Math.round(accuracy * 100) / 100,
      completed: true
    };

    // Remove any existing entry for today and add the new one
    const updatedEntries = dailyEntries.filter(entry => entry.date !== today);
    updatedEntries.push(newEntry);
    
    // Keep only last 30 days
    updatedEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (updatedEntries.length > 30) {
      updatedEntries.splice(0, updatedEntries.length - 30);
    }

    setDailyEntries(updatedEntries);
    setTodayCompleted(true);
    localStorage.setItem('dailyCalibration', JSON.stringify(updatedEntries));

    // Show positive reinforcement
    const dayNumber = getCurrentStreak(updatedEntries);
    const message = getPositiveMessage(dayNumber, accuracy);
    
    toast({
      title: `Day ${dayNumber} Complete!`,
      description: message,
      duration: 4000
    });

    return true;
  };

  const getCurrentStreak = (entries: DailyEntry[]) => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const entry = entries.find(e => e.date === dateStr);
      if (entry?.completed) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getPositiveMessage = (dayNumber: number, accuracy: number) => {
    const messages = [
      "Your motor control is awakening!",
      "Neural pathways are forming nicely.",
      "Your motor control is sharpening.",
      "Coordination circuits strengthening!",
      "Your precision is evolving beautifully.",
      "Motor memory consolidating perfectly.",
      "Your brain-hand connection is improving!"
    ];

    if (accuracy >= 90) {
      return "Exceptional motor mastery today!";
    } else if (accuracy >= 80) {
      return "Strong coordination development!";
    } else if (accuracy >= 60) {
      return messages[Math.min(dayNumber - 1, messages.length - 1)];
    } else {
      return "Every practice strengthens your neural networks.";
    }
  };

  const getLast5Days = () => {
    const today = new Date();
    const last5Days = [];
    
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const entry = dailyEntries.find(e => e.date === dateStr);
      last5Days.push({
        date: dateStr,
        accuracy: entry?.accuracy || 0,
        completed: entry?.completed || false,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    
    return last5Days;
  };

  return {
    dailyEntries,
    todayCompleted,
    todaysCompletion: todayCompleted ? dailyEntries.find(e => e.date === new Date().toISOString().split('T')[0]) : null,
    streak: { current: getCurrentStreak(dailyEntries), longest: getCurrentStreak(dailyEntries) },
    weekHistory: getLast5Days(),
    isLoading: false,
    canCalibrate: !todayCompleted,
    recordDailyAccuracy,
    getLast5Days,
    getCurrentStreak: () => getCurrentStreak(dailyEntries),
    completeCalibration: (score: number) => recordDailyAccuracy(score)
  };
};
