import { GameResult } from '@/hooks/useLocalProgress';

export const hasCompletedDailyCalibration = (): boolean => {
  const dailyCompletions = localStorage.getItem('dailyCalibrationCompleted');
  return dailyCompletions === 'true';
};

export const getCurrentStreak = (gameResults: GameResult[]): number => {
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

export const shouldShowProgressNudges = (): boolean => {
  const setting = localStorage.getItem('showProgressNudges');
  return setting !== 'false'; // Default to true
};