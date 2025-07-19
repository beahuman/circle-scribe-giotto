import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBrushSystem } from './useBrushSystem';

interface OffsetModeStats {
  totalAttempts: number;
  highestScore: number;
  averageScore: number;
  recentScores: number[];
  spiralModeCompletions: number;
  lastPlayedDate: string | null;
  mirrorOffsetUnlocked: boolean;
}

export const useOffsetMode = () => {
  const { toast } = useToast();
  const { checkForUnlocks } = useBrushSystem();
  const [stats, setStats] = useState<OffsetModeStats>({
    totalAttempts: 0,
    highestScore: 0,
    averageScore: 0,
    recentScores: [],
    spiralModeCompletions: 0,
    lastPlayedDate: null,
    mirrorOffsetUnlocked: false
  });

  // Check if Offset Mode is unlocked (3 Spiral Mode completions with 80%+)
  const isUnlocked = () => {
    const spiralCompletions = localStorage.getItem('spiralModeCompletions');
    return spiralCompletions ? parseInt(spiralCompletions) >= 3 : false;
  };

  // Check if user just unlocked Offset Mode
  const [hasShownUnlockModal, setHasShownUnlockModal] = useState(() => {
    return localStorage.getItem('offsetModeUnlockShown') === 'true';
  });

  const shouldShowUnlockModal = isUnlocked() && !hasShownUnlockModal;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('offsetModeStats');
    if (saved) {
      try {
        const parsedStats = JSON.parse(saved);
        setStats(parsedStats);
      } catch (error) {
        console.error('Failed to load Offset Mode stats:', error);
      }
    }
  };

  const saveStats = (newStats: OffsetModeStats) => {
    localStorage.setItem('offsetModeStats', JSON.stringify(newStats));
    setStats(newStats);
  };

  const recordOffsetScore = (score: number, isMirrorMode: boolean = false) => {
    const newScores = [...stats.recentScores, score].slice(-10);
    const totalAttempts = stats.totalAttempts + 1;
    const highestScore = Math.max(stats.highestScore, score);
    const averageScore = newScores.reduce((sum, s) => sum + s, 0) / newScores.length;
    
    const newStats: OffsetModeStats = {
      ...stats,
      totalAttempts,
      highestScore,
      averageScore: Math.round(averageScore * 100) / 100,
      recentScores: newScores,
      lastPlayedDate: new Date().toISOString()
    };

    // Check for unlocks
    checkBadgeUnlocks(score, newStats, isMirrorMode);
    
    // Check for brush unlocks
    checkForUnlocks();

    saveStats(newStats);
  };

  const checkBadgeUnlocks = (score: number, currentStats: OffsetModeStats, isMirrorMode: boolean) => {
    // Offset Visionary - Gold medal in Offset Mode (90%+)
    if (score >= 90) {
      toast({
        title: "🎯 Offset Visionary Badge Earned!",
        description: "Achieved gold medal accuracy in Offset Mode",
        duration: 5000
      });
    }

    // Reverse Engineer - Complete Mirror-Offset Mode with 80%+
    if (isMirrorMode && score >= 80) {
      toast({
        title: "🔄 Reverse Engineer Badge Earned!",
        description: "Master of mirror-offset perception",
        duration: 5000
      });
    }

    // Unlock Mirror-Offset if not already unlocked
    if (score >= 70 && !currentStats.mirrorOffsetUnlocked) {
      const updatedStats = { ...currentStats, mirrorOffsetUnlocked: true };
      saveStats(updatedStats);
      
      toast({
        title: "🪞 Mirror-Offset Mode Unlocked!",
        description: "New challenge variant available in Settings",
        duration: 6000
      });
    }
  };

  const markUnlockModalShown = () => {
    localStorage.setItem('offsetModeUnlockShown', 'true');
    setHasShownUnlockModal(true);
  };

  const getProgressTowardUnlock = () => {
    const spiralCompletions = localStorage.getItem('spiralModeCompletions');
    const current = spiralCompletions ? parseInt(spiralCompletions) : 0;
    return Math.min(current, 3);
  };

  const getNextUnlock = () => {
    const { totalAttempts } = stats;
    
    if (totalAttempts < 5) {
      return "Complete 5 Offset rounds to unlock Perception Gauntlet eligibility";
    } else {
      return "Offset Mode mastered!";
    }
  };

  return {
    isUnlocked: isUnlocked(),
    shouldShowUnlockModal,
    stats,
    recordOffsetScore,
    markUnlockModalShown,
    getProgressTowardUnlock,
    getNextUnlock,
    loadStats
  };
};