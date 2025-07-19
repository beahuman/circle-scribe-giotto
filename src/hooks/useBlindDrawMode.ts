import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useDailyCalibration } from './useDailyCalibration';

interface BlindDrawStats {
  totalAttempts: number;
  highestScore: number;
  averageScore: number;
  recentScores: number[];
  unlockedThemes: string[];
  lastPlayedDate: string | null;
}

export const useBlindDrawMode = () => {
  const { streak } = useDailyCalibration();
  const { toast } = useToast();
  const [stats, setStats] = useState<BlindDrawStats>({
    totalAttempts: 0,
    highestScore: 0,
    averageScore: 0,
    recentScores: [],
    unlockedThemes: [],
    lastPlayedDate: null
  });

  // Check if Blind Draw Mode is unlocked (7-day streak)
  const isUnlocked = streak.current >= 7;
  
  // Check if user just unlocked Blind Draw Mode
  const [hasShownUnlockModal, setHasShownUnlockModal] = useState(() => {
    return localStorage.getItem('blindDrawUnlockShown') === 'true';
  });

  const shouldShowUnlockModal = isUnlocked && !hasShownUnlockModal;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('blindDrawStats');
    if (saved) {
      try {
        const parsedStats = JSON.parse(saved);
        setStats(parsedStats);
      } catch (error) {
        console.error('Failed to load Blind Draw stats:', error);
      }
    }
  };

  const saveStats = (newStats: BlindDrawStats) => {
    localStorage.setItem('blindDrawStats', JSON.stringify(newStats));
    setStats(newStats);
  };

  const recordBlindDrawScore = (score: number) => {
    const newScores = [...stats.recentScores, score].slice(-10); // Keep last 10 scores
    const totalAttempts = stats.totalAttempts + 1;
    const highestScore = Math.max(stats.highestScore, score);
    const averageScore = newScores.reduce((sum, s) => sum + s, 0) / newScores.length;
    
    const newStats: BlindDrawStats = {
      ...stats,
      totalAttempts,
      highestScore,
      averageScore: Math.round(averageScore * 100) / 100,
      recentScores: newScores,
      lastPlayedDate: new Date().toISOString()
    };

    // Check for theme unlocks
    const newThemes = [...stats.unlockedThemes];
    
    if (totalAttempts >= 5 && !newThemes.includes('darkroom')) {
      newThemes.push('darkroom');
      toast({
        title: "🌑 Theme Unlocked!",
        description: "Darkroom theme is now available",
        duration: 4000
      });
    }
    
    if (totalAttempts >= 10 && !newThemes.includes('monastic')) {
      newThemes.push('monastic');
      toast({
        title: "📜 Theme Unlocked!",
        description: "Monastic theme is now available",
        duration: 4000
      });
    }
    
    newStats.unlockedThemes = newThemes;
    saveStats(newStats);

    // Check for new badges
    checkBadgeUnlocks(score, newStats);
  };

  const checkBadgeUnlocks = (score: number, currentStats: BlindDrawStats) => {
    // Neural Ninja - 85%+ in Blind Mode
    if (score >= 85) {
      toast({
        title: "🥷 Neural Ninja Badge Earned!",
        description: "Achieved 85%+ accuracy in Blind Draw Mode",
        duration: 5000
      });
    }

    // Circle Seer - Complete 10 total blind draws
    if (currentStats.totalAttempts >= 10) {
      toast({
        title: "👁️ Circle Seer Badge Earned!",
        description: "Completed 10 Blind Draw challenges",
        duration: 5000
      });
    }
  };

  const markUnlockModalShown = () => {
    localStorage.setItem('blindDrawUnlockShown', 'true');
    setHasShownUnlockModal(true);
  };

  const getNextUnlock = () => {
    const { totalAttempts } = stats;
    
    if (totalAttempts < 5) {
      return `${5 - totalAttempts} more Blind Draws to unlock Darkroom Theme`;
    } else if (totalAttempts < 10) {
      return `${10 - totalAttempts} more Blind Draws to unlock Monastic Theme`;
    } else if (totalAttempts < 15) {
      return `${15 - totalAttempts} more Blind Draws to unlock Spiral Mode`;
    } else if (totalAttempts < 25) {
      return `${25 - totalAttempts} more Blind Draws to unlock Offset Mode`;
    } else {
      return "All rewards unlocked!";
    }
  };

  const getProgressTowardUnlock = (type: 'spiral' | 'offset') => {
    const required = type === 'spiral' ? 5 : 10;
    const current = stats.totalAttempts;
    
    if (type === 'spiral') {
      return Math.min(current, 5);
    } else {
      return Math.min(current, 10);
    }
  };

  return {
    isUnlocked,
    shouldShowUnlockModal,
    stats,
    recordBlindDrawScore,
    markUnlockModalShown,
    getNextUnlock,
    getProgressTowardUnlock,
    loadStats
  };
};