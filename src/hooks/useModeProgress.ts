import { useState, useEffect } from 'react';

export interface ModeProgress {
  [modeId: string]: {
    bestScore: number;
    attempts: number;
    lastPlayed: number;
    averageScore: number;
  };
}

export const useModeProgress = () => {
  const [modeProgress, setModeProgress] = useState<ModeProgress>(() => {
    const saved = localStorage.getItem('modeProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever modeProgress changes
  useEffect(() => {
    localStorage.setItem('modeProgress', JSON.stringify(modeProgress));
  }, [modeProgress]);

  const updateModeProgress = (modeId: string, score: number) => {
    setModeProgress(prev => {
      const currentProgress = prev[modeId] || {
        bestScore: 0,
        attempts: 0,
        lastPlayed: 0,
        averageScore: 0
      };

      const newAttempts = currentProgress.attempts + 1;
      const newBestScore = Math.max(currentProgress.bestScore, score);
      const newAverageScore = (currentProgress.averageScore * currentProgress.attempts + score) / newAttempts;

      return {
        ...prev,
        [modeId]: {
          bestScore: newBestScore,
          attempts: newAttempts,
          lastPlayed: Date.now(),
          averageScore: Math.round(newAverageScore * 100) / 100
        }
      };
    });
  };

  const getModeProgress = (modeId: string) => {
    return modeProgress[modeId] || {
      bestScore: 0,
      attempts: 0,
      lastPlayed: 0,
      averageScore: 0
    };
  };

  const getAllModeProgress = () => {
    return modeProgress;
  };

  const resetModeProgress = (modeId?: string) => {
    if (modeId) {
      setModeProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[modeId];
        return newProgress;
      });
    } else {
      setModeProgress({});
    }
  };

  return {
    modeProgress,
    updateModeProgress,
    getModeProgress,
    getAllModeProgress,
    resetModeProgress
  };
};