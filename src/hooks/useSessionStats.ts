import { useEffect, useState } from 'react';
import { SessionStats } from '@/types/game';

export const useSessionStats = () => {
  const [sessionStats, setSessionStats] = useState<SessionStats>(() => {
    // Check if we have existing session stats that isn't too old (within the last hour)
    const savedStats = localStorage.getItem('currentSessionStats');
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      const oneHourAgo = Date.now() - 3600000; // 1 hour in milliseconds
      
      // If the session is recent, use it
      if (parsedStats.startTime > oneHourAgo) {
        return parsedStats;
      }
    }
    
    // Otherwise start a new session
    return {
      roundsPlayed: 0,
      averageAccuracy: 0,
      highestAccuracy: 0,
      lowestAccuracy: 100,
      startTime: Date.now()
    };
  });

  // Save session stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('currentSessionStats', JSON.stringify(sessionStats));
  }, [sessionStats]);

  const recordRound = (accuracy: number) => {
    setSessionStats(prev => {
      const newRoundsPlayed = prev.roundsPlayed + 1;
      // Calculate new average
      const newTotalAccuracy = prev.averageAccuracy * prev.roundsPlayed + accuracy;
      const newAverageAccuracy = newTotalAccuracy / newRoundsPlayed;
      
      return {
        roundsPlayed: newRoundsPlayed,
        averageAccuracy: newAverageAccuracy,
        highestAccuracy: Math.max(prev.highestAccuracy, accuracy),
        lowestAccuracy: Math.min(prev.lowestAccuracy, accuracy),
        startTime: prev.startTime
      };
    });
  };

  const resetSession = () => {
    setSessionStats({
      roundsPlayed: 0,
      averageAccuracy: 0,
      highestAccuracy: 0,
      lowestAccuracy: 100,
      startTime: Date.now()
    });
  };

  return {
    sessionStats,
    recordRound,
    resetSession
  };
};
