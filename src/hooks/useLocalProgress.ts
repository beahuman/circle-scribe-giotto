
import { useState, useEffect } from 'react';

export interface GameResult {
  id: string;
  score: number;
  timestamp: number;
  difficulty: number;
  isPenalty?: boolean;
}

export interface ProgressStats {
  bestScore: number;
  threeDayAverage: number;
  lastAttempt: number | null;
  totalGames: number;
  achievements?: string[];
}

export const useLocalProgress = () => {
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    bestScore: 0,
    threeDayAverage: 0,
    lastAttempt: null,
    totalGames: 0
  });

  useEffect(() => {
    loadGameResults();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [gameResults]);

  const loadGameResults = () => {
    try {
      const saved = localStorage.getItem('localGameResults');
      if (saved) {
        const results = JSON.parse(saved);
        setGameResults(results);
      }
    } catch (error) {
      console.error('Failed to load game results:', error);
    }
  };

  const saveGameResults = (results: GameResult[]) => {
    try {
      localStorage.setItem('localGameResults', JSON.stringify(results));
    } catch (error) {
      console.error('Failed to save game results:', error);
    }
  };

  const addGameResult = (score: number, difficulty: number, isPenalty?: boolean) => {
    const newResult: GameResult = {
      id: Date.now().toString(),
      score,
      timestamp: Date.now(),
      difficulty,
      isPenalty
    };

    const updatedResults = [newResult, ...gameResults].slice(0, 10); // Keep only last 10
    setGameResults(updatedResults);
    saveGameResults(updatedResults);
  };

  const calculateStats = () => {
    if (gameResults.length === 0) {
      setStats({
        bestScore: 0,
        threeDayAverage: 0,
        lastAttempt: null,
        totalGames: 0
      });
      return;
    }

    // Best score
    const bestScore = Math.max(...gameResults.map(r => r.score));

    // Last attempt
    const lastAttempt = gameResults[0]?.score || null;

    // 3-day average (games from last 72 hours)
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
    const recentGames = gameResults.filter(r => r.timestamp > threeDaysAgo);
    const threeDayAverage = recentGames.length > 0 
      ? recentGames.reduce((sum, r) => sum + r.score, 0) / recentGames.length 
      : 0;

    setStats({
      bestScore,
      threeDayAverage: Math.round(threeDayAverage * 100) / 100,
      lastAttempt,
      totalGames: gameResults.length
    });
  };

  const clearResults = () => {
    setGameResults([]);
    localStorage.removeItem('localGameResults');
  };

  return {
    gameResults,
    stats,
    addGameResult,
    clearResults
  };
};
