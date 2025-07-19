
import { useEffect, useState } from 'react';

export interface PlayerProgress {
  xp: number;
  level: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
}

const XP_PER_LEVEL = 100;

export const usePlayerProgress = () => {
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(() => {
    // Load progress from localStorage or initialize with defaults
    const savedProgress = localStorage.getItem('playerProgress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    return {
      xp: 0,
      level: 1,
      xpForNextLevel: XP_PER_LEVEL,
      xpInCurrentLevel: 0
    };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('playerProgress', JSON.stringify(playerProgress));
  }, [playerProgress]);

  const addXp = (accuracyScore: number) => {
    // Calculate XP gain (1 XP for every 5% of accuracy)
    const xpGained = Math.floor(accuracyScore / 5);
    
    // Calculate new total XP
    const newTotalXp = playerProgress.xp + xpGained;
    
    // Calculate new level and XP within that level
    const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
    const newXpInCurrentLevel = newTotalXp % XP_PER_LEVEL;
    
    // Check if leveled up
    const didLevelUp = newLevel > playerProgress.level;
    
    // Update player progress
    setPlayerProgress({
      xp: newTotalXp,
      level: newLevel,
      xpForNextLevel: XP_PER_LEVEL,
      xpInCurrentLevel: newXpInCurrentLevel
    });
    
    return {
      xpGained,
      didLevelUp,
      newLevel
    };
  };

  // New function to spend XP on cosmetics
  const spendXp = (amount: number): boolean => {
    if (playerProgress.xp < amount) {
      return false; // Not enough XP
    }
    
    // Calculate new total XP after spending
    const newTotalXp = playerProgress.xp - amount;
    
    // Calculate new level and XP within that level
    const newLevel = Math.floor(newTotalXp / XP_PER_LEVEL) + 1;
    const newXpInCurrentLevel = newTotalXp % XP_PER_LEVEL;
    
    // Update player progress
    setPlayerProgress({
      xp: newTotalXp,
      level: newLevel,
      xpForNextLevel: XP_PER_LEVEL,
      xpInCurrentLevel: newXpInCurrentLevel
    });
    
    return true; // Successfully spent XP
  };

  return {
    ...playerProgress,
    addXp,
    spendXp
  };
};
