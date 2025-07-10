import { useState, useCallback } from 'react';
import { GameState } from '@/types/game';

export const useGameModals = () => {
  const [showEducationalModal, setShowEducationalModal] = useState(false);
  const [pendingGameState, setPendingGameState] = useState<'showing' | null>(null);
  const [showBlindUnlockModal, setShowBlindUnlockModal] = useState(false);

  const handleEducationalComplete = useCallback(() => {
    setShowEducationalModal(false);
    if (pendingGameState) {
      setPendingGameState(null);
    }
  }, [pendingGameState]);

  const handleEducationalClose = useCallback(() => {
    setShowEducationalModal(false);
    setPendingGameState(null);
  }, []);

  const showEducationalModalForSession = useCallback((sessionDrawings: number, isDailyMode: boolean, isDailyChallengeMode: boolean) => {
    const shouldShowEducational = sessionDrawings > 0 && (sessionDrawings + 1) % 3 === 0 && !isDailyMode && !isDailyChallengeMode;
    
    if (shouldShowEducational) {
      setPendingGameState('showing');
      setShowEducationalModal(true);
      return true;
    }
    return false;
  }, []);

  return {
    showEducationalModal,
    setShowEducationalModal,
    pendingGameState,
    setPendingGameState,
    showBlindUnlockModal,
    setShowBlindUnlockModal,
    handleEducationalComplete,
    handleEducationalClose,
    showEducationalModalForSession
  };
};