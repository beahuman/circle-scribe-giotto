import { useState, useEffect } from 'react';

export type GameModeType = 'practice' | 'daily' | 'blind-draw' | 'shapes' | 'infinite-practice' | 'offset' | 'penalty' | 'daily-challenge';

interface ModeRepetitionState {
  currentMode: GameModeType | null;
  repetitionCount: number;
  hasShownNudge: boolean;
  sessionId: string;
}

export const useModeRepetitionNudge = () => {
  const [repetitionState, setRepetitionState] = useState<ModeRepetitionState>(() => {
    // Load from sessionStorage (resets when browser session ends)
    const saved = sessionStorage.getItem('modeRepetitionState');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      currentMode: null,
      repetitionCount: 0,
      hasShownNudge: false,
      sessionId: Date.now().toString()
    };
  });

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    sessionStorage.setItem('modeRepetitionState', JSON.stringify(repetitionState));
  }, [repetitionState]);

  // Track mode play
  const trackModePlay = (mode: GameModeType) => {
    setRepetitionState(prev => {
      if (prev.currentMode === mode) {
        // Same mode, increment count
        return {
          ...prev,
          repetitionCount: prev.repetitionCount + 1,
          hasShownNudge: false // Reset nudge for new counts
        };
      } else {
        // Different mode, reset
        return {
          currentMode: mode,
          repetitionCount: 1,
          hasShownNudge: false,
          sessionId: prev.sessionId
        };
      }
    });
  };

  // Check if we should show nudge
  const shouldShowNudge = (): boolean => {
    return (
      repetitionState.repetitionCount >= 3 && 
      !repetitionState.hasShownNudge &&
      repetitionState.currentMode !== null
    );
  };

  // Mark nudge as shown
  const markNudgeShown = () => {
    setRepetitionState(prev => ({
      ...prev,
      hasShownNudge: true
    }));
  };

  // Get suggested alternative mode
  const getSuggestedMode = (): GameModeType | null => {
    if (!repetitionState.currentMode) return null;

    const modeAlternatives: Record<GameModeType, GameModeType[]> = {
      'practice': ['shapes', 'blind-draw', 'infinite-practice'],
      'daily': ['practice', 'shapes', 'blind-draw'],
      'blind-draw': ['practice', 'shapes', 'offset'],
      'shapes': ['practice', 'blind-draw', 'infinite-practice'],
      'infinite-practice': ['practice', 'shapes', 'blind-draw'],
      'offset': ['practice', 'shapes', 'blind-draw'],
      'penalty': ['practice', 'shapes', 'blind-draw'],
      'daily-challenge': ['practice', 'shapes', 'blind-draw']
    };

    const alternatives = modeAlternatives[repetitionState.currentMode] || ['practice'];
    
    // Return first alternative for now, could be made smarter later
    return alternatives[0];
  };

  // Get mode display name
  const getModeDisplayName = (mode: GameModeType): string => {
    const displayNames: Record<GameModeType, string> = {
      'practice': 'Practice',
      'daily': 'Daily Calibration',
      'blind-draw': 'Blind Draw',
      'shapes': 'Shape Training',
      'infinite-practice': 'Infinite Practice',
      'offset': 'Offset Mode',
      'penalty': 'Penalty Mode',
      'daily-challenge': 'Daily Challenge'
    };

    return displayNames[mode] || mode;
  };

  // Reset repetition (when user manually changes mode)
  const resetRepetition = () => {
    setRepetitionState({
      currentMode: null,
      repetitionCount: 0,
      hasShownNudge: false,
      sessionId: Date.now().toString()
    });
  };

  return {
    repetitionState,
    trackModePlay,
    shouldShowNudge,
    markNudgeShown,
    getSuggestedMode,
    getModeDisplayName,
    resetRepetition
  };
};