import { useState, useEffect } from 'react';
import { useLocalProgress } from './useLocalProgress';
import { useDailyCalibration } from './useDailyCalibration';
import { useToneSystem } from './useToneSystem';
import { useToast } from './use-toast';

export interface UnlockTrigger {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  checkUnlock: (stats: any, calibration: any) => boolean;
  rewardBadge?: string;
  rewardBrush?: string;
}

export interface UnlockedMode {
  id: string;
  name: string;
  unlockedAt: string;
  isNew: boolean; // Show "Recently Unlocked" for 2 sessions
}

const UNLOCK_TRIGGERS: UnlockTrigger[] = [
  {
    id: 'blind-draw',
    name: 'Blind Draw Mode',
    description: 'Draw without seeing your stroke - pure memory training',
    unlockCondition: '3 Daily Calibrations + 1 Practice score > 85%',
    checkUnlock: (stats, calibration) => {
      const hasCalibrations = calibration.streak.current >= 3;
      const hasPracticeScore = stats.bestScore >= 85;
      return hasCalibrations && hasPracticeScore;
    },
    rewardBadge: 'Memory Master',
    rewardBrush: 'Phantom Stroke'
  },
  {
    id: 'spiral-mode',
    name: 'Spiral Mode',
    description: 'Follow the winding path of the spiral',
    unlockCondition: '3 Blind Draw completions',
    checkUnlock: (stats) => {
      const blindDrawCount = parseInt(localStorage.getItem('blindDrawCompletions') || '0');
      return blindDrawCount >= 3;
    },
    rewardBadge: 'Spiral Seeker',
    rewardBrush: 'Loopline'
  },
  {
    id: 'offset-mode',
    name: 'Offset Mode',
    description: 'Reference circle placed off-center - tests perception alignment',
    unlockCondition: '3 Spiral completions with 80%+ average',
    checkUnlock: () => {
      const spiralScores = JSON.parse(localStorage.getItem('spiralScores') || '[]');
      if (spiralScores.length < 3) return false;
      const avgScore = spiralScores.reduce((sum: number, score: number) => sum + score, 0) / spiralScores.length;
      return avgScore >= 80;
    },
    rewardBadge: 'Alignment Expert',
    rewardBrush: 'Offset Tracer'
  },
  {
    id: 'perception-gauntlet',
    name: 'Perception Gauntlet',
    description: 'Ultimate challenge: off-center AND hidden reference circle',
    unlockCondition: '5 Blind Draw + 5 Offset completions',
    checkUnlock: () => {
      const blindDrawCount = parseInt(localStorage.getItem('blindDrawCompletions') || '0');
      const offsetCount = parseInt(localStorage.getItem('offsetCompletions') || '0');
      return blindDrawCount >= 5 && offsetCount >= 5;
    },
    rewardBadge: 'Gauntlet Champion',
    rewardBrush: 'Ultimate Precision'
  }
];

export const useModeUnlockSystem = () => {
  const { stats } = useLocalProgress();
  const calibration = useDailyCalibration();
  const { selectedTone } = useToneSystem();
  const { toast } = useToast();
  
  const [unlockedModes, setUnlockedModes] = useState<UnlockedMode[]>(() => {
    const saved = localStorage.getItem('unlockedModes');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAllModes, setShowAllModes] = useState(() => {
    return localStorage.getItem('showAllLockedModes') === 'true';
  });

  const [pendingUnlock, setPendingUnlock] = useState<UnlockTrigger | null>(null);

  // Check for new unlocks
  useEffect(() => {
    for (const trigger of UNLOCK_TRIGGERS) {
      const isAlreadyUnlocked = unlockedModes.some(mode => mode.id === trigger.id);
      
      if (!isAlreadyUnlocked && trigger.checkUnlock(stats, calibration)) {
        // New unlock detected
        const newMode: UnlockedMode = {
          id: trigger.id,
          name: trigger.name,
          unlockedAt: new Date().toISOString(),
          isNew: true
        };
        
        const updatedModes = [...unlockedModes, newMode];
        setUnlockedModes(updatedModes);
        localStorage.setItem('unlockedModes', JSON.stringify(updatedModes));
        
        // Show unlock modal
        setPendingUnlock(trigger);
        break;
      }
    }
  }, [stats, calibration, unlockedModes]);

  // Mark modes as no longer new after 2 sessions
  useEffect(() => {
    const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
    
    const updatedModes = unlockedModes.map(mode => {
      if (mode.isNew) {
        const unlockedSession = parseInt(localStorage.getItem(`unlockSession_${mode.id}`) || sessionCount.toString());
        if (sessionCount - unlockedSession >= 2) {
          return { ...mode, isNew: false };
        }
      }
      return mode;
    });
    
    if (JSON.stringify(updatedModes) !== JSON.stringify(unlockedModes)) {
      setUnlockedModes(updatedModes);
      localStorage.setItem('unlockedModes', JSON.stringify(updatedModes));
    }
  }, [unlockedModes]);

  const isUnlocked = (modeId: string): boolean => {
    return unlockedModes.some(mode => mode.id === modeId);
  };

  const isNewlyUnlocked = (modeId: string): boolean => {
    const mode = unlockedModes.find(mode => mode.id === modeId);
    return mode?.isNew || false;
  };

  const getUnlockMessage = (trigger: UnlockTrigger): string => {
    const tone = selectedTone;
    
    switch (tone) {
      case 'playful':
        return `Whoa! You've unlocked ${trigger.name}. Let's get wild! 🎨`;
      case 'calm':
        return `Your focus has deepened. ${trigger.name} now available. 🧘`;
      case 'formal':
        return `Achievement unlocked: ${trigger.name} module is now accessible.`;
      case 'sarcastic':
        return `Congrats. The game's now harder. ${trigger.name} unlocked. 😏`;
      default:
        return `${trigger.name} unlocked! Ready for the next challenge?`;
    }
  };

  const getProgressNudge = (): string | null => {
    for (const trigger of UNLOCK_TRIGGERS) {
      const isAlreadyUnlocked = unlockedModes.some(mode => mode.id === trigger.id);
      if (isAlreadyUnlocked) continue;

      // Check if close to unlocking
      if (trigger.id === 'blind-draw') {
        const needsCalibration = calibration.streak.current < 3;
        const needsPractice = stats.bestScore < 85;
        
        if (needsCalibration && calibration.streak.current >= 1) {
          return `${3 - calibration.streak.current} more daily calibrations and something new might appear...`;
        }
        if (needsPractice && stats.bestScore >= 70) {
          return `Score ${85 - stats.bestScore} points higher and you might unlock something special...`;
        }
      }
    }
    return null;
  };

  const handleUnlockModalClose = () => {
    if (pendingUnlock) {
      // Mark unlock session for "new" tracking
      const sessionCount = parseInt(localStorage.getItem('sessionCount') || '0');
      localStorage.setItem(`unlockSession_${pendingUnlock.id}`, sessionCount.toString());
    }
    setPendingUnlock(null);
  };

  const handleTryNewMode = () => {
    if (pendingUnlock) {
      // Navigate to the new mode
      window.location.href = `/?mode=${pendingUnlock.id}`;
    }
    handleUnlockModalClose();
  };

  const toggleShowAllModes = () => {
    const newValue = !showAllModes;
    setShowAllModes(newValue);
    localStorage.setItem('showAllLockedModes', newValue.toString());
  };

  const getAvailableModes = () => {
    const baseModes = [
      { id: 'practice', name: 'Practice Mode', available: true },
      { id: 'infinite', name: 'Infinite Practice', available: true }
    ];

    if (showAllModes) {
      // Show all modes with lock status
      return [
        ...baseModes,
        ...UNLOCK_TRIGGERS.map(trigger => ({
          id: trigger.id,
          name: trigger.name,
          available: isUnlocked(trigger.id),
          unlockCondition: trigger.unlockCondition
        }))
      ];
    } else {
      // Only show unlocked modes
      const unlockedTriggers = UNLOCK_TRIGGERS.filter(trigger => isUnlocked(trigger.id))
        .map(trigger => ({
          id: trigger.id,
          name: trigger.name,
          available: true
        }));
      
      return [...baseModes, ...unlockedTriggers];
    }
  };

  return {
    unlockedModes,
    isUnlocked,
    isNewlyUnlocked,
    pendingUnlock,
    getUnlockMessage,
    getProgressNudge,
    handleUnlockModalClose,
    handleTryNewMode,
    showAllModes,
    toggleShowAllModes,
    getAvailableModes,
    unlockTriggers: UNLOCK_TRIGGERS
  };
};