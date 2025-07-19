import { useState, useEffect } from 'react';
import { useLocalProgress } from './useLocalProgress';
import { usePlayerProgress } from './usePlayerProgress';
import { useAdaptiveFeedback } from './useAdaptiveFeedback';

export interface ScoreScreenEvolution {
  // Visual tier based on user experience
  tier: 'early' | 'intermediate' | 'advanced';
  
  // Visual effects to apply
  effects: {
    scoreHalo: boolean;
    slideUpReveal: boolean;
    dimmedBackground: boolean;
    streakGlow: boolean;
    modeUnlockBadge: boolean;
    celebrationBurst: boolean;
    ghostTrailOverlay: boolean;
    performanceTracker: boolean;
  };
  
  // Layout adjustments
  layout: {
    showSubmetrics: boolean;
    compactMode: boolean;
    advancedVisuals: boolean;
    showComparison: boolean;
  };
  
  // Streak and achievement data
  achievements: {
    isPersonalBest: boolean;
    streakDays: number;
    scoreImprovement: number | null;
    averageImprovement: string | null;
    recentUnlocks: string[];
  };
}

export const useEvolvingScoreScreen = (
  currentScore: number,
  difficultyLevel: number,
  isPenaltyMode: boolean = false,
  sessionRoundsPlayed: number = 0
) => {
  const { stats, gameResults } = useLocalProgress();
  const playerProgress = usePlayerProgress();
  const { adaptiveSettings } = useAdaptiveFeedback();
  
  const [evolution, setEvolution] = useState<ScoreScreenEvolution>({
    tier: 'early',
    effects: {
      scoreHalo: false,
      slideUpReveal: false,
      dimmedBackground: false,
      streakGlow: false,
      modeUnlockBadge: false,
      celebrationBurst: false,
      ghostTrailOverlay: false,
      performanceTracker: false
    },
    layout: {
      showSubmetrics: false,
      compactMode: true,
      advancedVisuals: false,
      showComparison: false
    },
    achievements: {
      isPersonalBest: false,
      streakDays: 0,
      scoreImprovement: null,
      averageImprovement: null,
      recentUnlocks: []
    }
  });

  useEffect(() => {
    calculateEvolution();
  }, [currentScore, stats, playerProgress, gameResults, adaptiveSettings]);

  const calculateEvolution = () => {
    const totalGames = stats.totalGames;
    const isPersonalBest = currentScore > stats.bestScore;
    const lastFiveScores = gameResults.slice(-5).map(r => r.score);
    const avgLastFive = lastFiveScores.length > 0 
      ? lastFiveScores.reduce((a, b) => a + b, 0) / lastFiveScores.length 
      : 0;
    
    // Calculate score improvement from last attempt
    const scoreImprovement = stats.lastAttempt 
      ? currentScore - stats.lastAttempt 
      : null;
    
    // Calculate 5-day average improvement
    const averageImprovement = avgLastFive > 0 && currentScore > avgLastFive
      ? `+${(currentScore - avgLastFive).toFixed(1)}% over your 5-day average`
      : null;

    // Determine user tier
    let tier: 'early' | 'intermediate' | 'advanced' = 'early';
    if (totalGames >= 30 || playerProgress.level >= 6) {
      tier = 'advanced';
    } else if (totalGames >= 5 || playerProgress.level >= 3) {
      tier = 'intermediate';
    }

    // Determine visual effects
    const effects = {
      scoreHalo: currentScore >= 90,
      slideUpReveal: isPersonalBest,
      dimmedBackground: scoreImprovement !== null && scoreImprovement < -20,
      streakGlow: getStreakDays() >= 3,
      modeUnlockBadge: checkForModeUnlock(),
      celebrationBurst: isPersonalBest && currentScore >= 85,
      ghostTrailOverlay: tier === 'advanced' && adaptiveSettings.enabled,
      performanceTracker: tier === 'advanced' && averageImprovement !== null
    };

    // Determine layout
    const layout = {
      showSubmetrics: tier !== 'early',
      compactMode: tier === 'early',
      advancedVisuals: tier === 'advanced',
      showComparison: tier === 'advanced' && gameResults.length >= 10
    };

    // Get recent unlocks (simulated for now)
    const recentUnlocks = getRecentUnlocks();

    setEvolution({
      tier,
      effects,
      layout,
      achievements: {
        isPersonalBest,
        streakDays: getStreakDays(),
        scoreImprovement,
        averageImprovement,
        recentUnlocks
      }
    });
  };

  const getStreakDays = (): number => {
    // Calculate streak based on recent daily activity
    const today = new Date().toDateString();
    const recentDays = gameResults
      .filter(result => {
        const resultDate = new Date(result.timestamp).toDateString();
        const daysDiff = Math.floor((Date.now() - result.timestamp) / (24 * 60 * 60 * 1000));
        return daysDiff <= 7;
      })
      .map(result => new Date(result.timestamp).toDateString())
      .filter((date, index, array) => array.indexOf(date) === index);
    
    return Math.min(recentDays.length, 7);
  };

  const checkForModeUnlock = (): boolean => {
    // Check if this score/session might have unlocked something
    return currentScore >= 85 && sessionRoundsPlayed <= 1;
  };

  const getRecentUnlocks = (): string[] => {
    const unlocks: string[] = [];
    
    // Check for brush unlocks
    if (currentScore >= 90 && !localStorage.getItem('glowline_unlocked')) {
      unlocks.push('Glowline Brush');
      localStorage.setItem('glowline_unlocked', 'true');
    }
    
    // Check for theme unlocks
    if (getStreakDays() >= 7 && !localStorage.getItem('zen_theme_unlocked')) {
      unlocks.push('Zen Theme');
      localStorage.setItem('zen_theme_unlocked', 'true');
    }
    
    return unlocks;
  };

  return evolution;
};