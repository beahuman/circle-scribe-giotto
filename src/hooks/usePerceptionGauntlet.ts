import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useBlindDrawMode } from './useBlindDrawMode';
import { useOffsetMode } from './useOffsetMode';
import { useBrushSystem } from './useBrushSystem';

interface PerceptionGauntletStats {
  totalAttempts: number;
  highestScore: number;
  averageScore: number;
  recentScores: number[];
  lastPlayedDate: string | null;
  themeUnlocked: boolean;
  brushUnlocked: boolean;
}

export const usePerceptionGauntlet = () => {
  const { toast } = useToast();
  const { stats: blindDrawStats } = useBlindDrawMode();
  const { stats: offsetStats } = useOffsetMode();
  const { checkForUnlocks } = useBrushSystem();
  
  const [stats, setStats] = useState<PerceptionGauntletStats>({
    totalAttempts: 0,
    highestScore: 0,
    averageScore: 0,
    recentScores: [],
    lastPlayedDate: null,
    themeUnlocked: false,
    brushUnlocked: false
  });

  // Check if Perception Gauntlet is unlocked
  const isUnlocked = () => {
    return blindDrawStats.totalAttempts >= 5 && offsetStats.totalAttempts >= 5;
  };

  // Check if user just unlocked Perception Gauntlet
  const [hasShownUnlockModal, setHasShownUnlockModal] = useState(() => {
    return localStorage.getItem('perceptionGauntletUnlockShown') === 'true';
  });

  const shouldShowUnlockModal = isUnlocked() && !hasShownUnlockModal;

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('perceptionGauntletStats');
    if (saved) {
      try {
        const parsedStats = JSON.parse(saved);
        setStats(parsedStats);
      } catch (error) {
        console.error('Failed to load Perception Gauntlet stats:', error);
      }
    }
  };

  const saveStats = (newStats: PerceptionGauntletStats) => {
    localStorage.setItem('perceptionGauntletStats', JSON.stringify(newStats));
    setStats(newStats);
  };

  const recordGauntletScore = (score: number) => {
    const newScores = [...stats.recentScores, score].slice(-10);
    const totalAttempts = stats.totalAttempts + 1;
    const highestScore = Math.max(stats.highestScore, score);
    const averageScore = newScores.reduce((sum, s) => sum + s, 0) / newScores.length;
    
    const newStats: PerceptionGauntletStats = {
      ...stats,
      totalAttempts,
      highestScore,
      averageScore: Math.round(averageScore * 100) / 100,
      recentScores: newScores,
      lastPlayedDate: new Date().toISOString()
    };

    // Check for unlocks
    checkGauntletUnlocks(score, newStats);
    
    // Check for brush unlocks
    checkForUnlocks();

    saveStats(newStats);
  };

  const checkGauntletUnlocks = (score: number, currentStats: PerceptionGauntletStats) => {
    // Cerebral Cyclist - 85%+ score in Perception Gauntlet
    if (score >= 85) {
      toast({
        title: "🧠 Cerebral Cyclist Badge Earned!",
        description: "Master of cognitive adaptability",
        duration: 5000
      });
    }

    // Perception Gauntlet Champ - Gold medal (90%+)
    if (score >= 90) {
      toast({
        title: "🏆 Perception Gauntlet Champion!",
        description: "Peak motor stability under uncertainty",
        duration: 6000
      });
    }

    // Unlock Fractal Brush
    if (score >= 80 && !currentStats.brushUnlocked) {
      const updatedStats = { ...currentStats, brushUnlocked: true };
      saveStats(updatedStats);
      
      // Unlock in brush system
      const brushUnlocks = JSON.parse(localStorage.getItem('brushUnlocks') || '[]');
      if (!brushUnlocks.includes('fractal')) {
        brushUnlocks.push('fractal');
        localStorage.setItem('brushUnlocks', JSON.stringify(brushUnlocks));
      }
      
      toast({
        title: "✨ Fractal Brush Unlocked!",
        description: "New brush style available for your mastery",
        duration: 6000
      });
    }

    // Unlock Perception Warp Theme
    if (score >= 75 && !currentStats.themeUnlocked) {
      const updatedStats = { ...currentStats, themeUnlocked: true };
      saveStats(updatedStats);
      
      // Unlock in theme system
      const themeUnlocks = JSON.parse(localStorage.getItem('themeUnlocks') || '[]');
      if (!themeUnlocks.includes('perception-warp')) {
        themeUnlocks.push('perception-warp');
        localStorage.setItem('themeUnlocks', JSON.stringify(themeUnlocks));
      }
      
      toast({
        title: "🌀 Perception Warp Theme Unlocked!",
        description: "Reality bends to your precision",
        duration: 6000
      });
    }
  };

  const markUnlockModalShown = () => {
    localStorage.setItem('perceptionGauntletUnlockShown', 'true');
    setHasShownUnlockModal(true);
  };

  const getProgressTowardUnlock = () => {
    const blindDrawProgress = Math.min(blindDrawStats.totalAttempts, 5);
    const offsetProgress = Math.min(offsetStats.totalAttempts, 5);
    return { blindDrawProgress, offsetProgress };
  };

  const getNextUnlock = () => {
    const { totalAttempts } = stats;
    
    if (totalAttempts === 0) {
      return "The ultimate perceptual challenge awaits";
    } else if (totalAttempts < 5) {
      return `${5 - totalAttempts} more attempts to master the Gauntlet`;
    } else {
      return "Perception Gauntlet conquered!";
    }
  };

  return {
    isUnlocked: isUnlocked(),
    shouldShowUnlockModal,
    stats,
    recordGauntletScore,
    markUnlockModalShown,
    getProgressTowardUnlock,
    getNextUnlock,
    loadStats
  };
};