import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircleDisplay from './CircleDisplay';
import ResultScreen from './ResultScreen';
import SessionStatsView from './SessionStatsView';
import EducationalModal from './modal/EducationalModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { GameProps } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useSessionStats } from '@/hooks/useSessionStats';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useGameService } from '@/hooks/useGameService';
import { useGameHandlers } from '@/features/game/gameHandlers';
import MobileWarning from './game/MobileWarning';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import { useBlindDrawMode } from '@/hooks/useBlindDrawMode';
import BlindDrawUnlockModal from './BlindDrawUnlockModal';
import { useGameModes } from '@/hooks/useGameModes';
import { useGameModals } from '@/hooks/useGameModals';
import { useGameHandlers as useEnhancedGameHandlers } from '@/hooks/useGameHandlers';
import GameCanvas from './game/GameCanvas';
import { useFirstDrawTutorial } from '@/hooks/useFirstDrawTutorial';
import FirstDrawTutorial from './tutorial/FirstDrawTutorial';
import LogoHeader from './common/LogoHeader';

const GiottoGame: React.FC<GameProps> = ({ onReturnToHome, onRemoveAds }) => {
  // Game state management
  const {
    gameState,
    setGameState,
    accuracy,
    setAccuracy,
    targetCircle,
    setTargetCircle,
    bypassMobileCheck,
    setBypassMobileCheck,
    drawnPoints,
    setDrawnPoints,
    difficultyLevel,
    setDifficultyLevel,
    displayDuration,
    consecutiveLowScores,
    setConsecutiveLowScores,
    penaltyModeEnabled,
    setPenaltyModeEnabled,
    sessionDrawings,
    setSessionDrawings,
    streakCount,
    setStreakCount,
    toast
  } = useGameState();
  
  // Session stats tracking
  const { sessionStats, resetSession } = useSessionStats();
  
  // Track session for neuroplasticity feedback
  useSessionTracking();
  
  // Game service for leaderboard and score submission
  const { isGameServiceAvailable, submitScore, showLeaderboard } = useGameService();
  
  // Game interaction handlers
  const {
    handleCircleMemorized,
    handleDrawingComplete,
    handleReplay,
    handleBypassMobile,
    isPenaltyMode
  } = useGameHandlers({
    setGameState,
    setAccuracy,
    setDrawnPoints,
    setSessionDrawings,
    setStreakCount,
    setConsecutiveLowScores,
    setTargetCircle,
    setDifficultyLevel,
    submitScore,
    toast,
    difficultyLevel,
    streakCount,
    sessionDrawings,
    consecutiveLowScores,
    penaltyModeEnabled,
    gameState
  });
  
  const isMobile = useIsMobile();
  
  // Add daily calibration hook
  const { todayCompleted } = useDailyCalibration();
  
  // Add mode hooks
  const { shouldShowUnlockModal, markUnlockModalShown } = useBlindDrawMode();
  
  // Game mode detection
  const { 
    isDailyMode, 
    isDailyChallengeMode, 
    isBlindDrawMode, 
    isOffsetMode, 
    isPerceptionGauntletMode, 
    isInfinitePracticeMode 
  } = useGameModes();
  
  // Modal management
  const {
    showEducationalModal,
    showBlindUnlockModal,
    setShowBlindUnlockModal,
    handleEducationalComplete,
    handleEducationalClose,
    showEducationalModalForSession
  } = useGameModals();
  
  // Enhanced handlers
  const { handleEnhancedDrawingComplete } = useEnhancedGameHandlers({
    isDailyMode,
    isDailyChallengeMode,
    isBlindDrawMode,
    handleDrawingComplete
  });

  // First draw tutorial
  const { isFirstDraw, completeFirstDraw } = useFirstDrawTutorial();

  // Check if should show unlock modal on game start
  useEffect(() => {
    if (shouldShowUnlockModal) {
      setShowBlindUnlockModal(true);
    }
  }, [shouldShowUnlockModal, setShowBlindUnlockModal]);

  // Handle starting blind draw from unlock modal
  const handleStartBlindDrawFromModal = () => {
    setShowBlindUnlockModal(false);
    markUnlockModalShown();
    window.location.href = '/?mode=blind-draw';
  };
  
  // Override replay handler for daily mode and daily challenge mode
  const handleDailyAwareReplay = () => {
    if ((isDailyMode || isDailyChallengeMode) && todayCompleted) {
      toast({
        title: isDailyChallengeMode ? "Daily challenge complete" : "Daily calibration complete",
        description: "Return tomorrow for your next session!",
        duration: 3000
      });
      return;
    }

    const shouldShow = showEducationalModalForSession(sessionDrawings, isDailyMode, isDailyChallengeMode);
    if (!shouldShow) {
      handleReplay();
    }
  };
  
  // View stats handler
  const handleViewStats = () => {
    setGameState('stats');
  };
  
  // Back to results handler
  const handleBackToResults = () => {
    setGameState('result');
  };
  
  // Mobile device check
  if (!isMobile && !bypassMobileCheck) {
    return (
      <MobileWarning 
        onBypassMobile={() => {
          setBypassMobileCheck(true);
          handleBypassMobile();
        }}
      />
    );
  }
  
  // Check if we're in penalty mode
  const inPenaltyMode = isPenaltyMode();

  // First draw tutorial takes precedence
  if (isFirstDraw) {
    return (
      <FirstDrawTutorial
        onComplete={completeFirstDraw}
        onStartPractice={() => {
          completeFirstDraw();
          onReturnToHome();
        }}
        onStartDaily={() => {
          completeFirstDraw();
          window.location.href = '/?mode=daily';
        }}
      />
    );
  }
  
  // Render the current game state
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Logo Header - Top Left - Grid Aligned with Safe Margins */}
      <div className="absolute top-6 left-6 z-10 md:top-8 md:left-8">
        <LogoHeader position="left" size="small" />
      </div>
      
      <AnimatePresence mode="wait">
        {gameState === 'showing' && (
          <motion.div
            key="showing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <CircleDisplay 
              duration={displayDuration} 
              onComplete={handleCircleMemorized}
              circleProps={targetCircle}
              isPenaltyMode={inPenaltyMode}
            />
          </motion.div>
        )}
        
        {gameState === 'drawing' && (
          <motion.div
            key="drawing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <GameCanvas
              isBlindDrawMode={isBlindDrawMode}
              isOffsetMode={isOffsetMode}
              isPerceptionGauntletMode={isPerceptionGauntletMode}
              isInfinitePracticeMode={isInfinitePracticeMode}
              onComplete={handleEnhancedDrawingComplete}
              targetCircle={targetCircle}
              difficultyLevel={difficultyLevel}
              inPenaltyMode={inPenaltyMode}
            />
          </motion.div>
        )}
        
        {gameState === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <ResultScreen 
              accuracy={accuracy}
              difficultyLevel={difficultyLevel}
              onReplay={(isDailyMode || isDailyChallengeMode) ? handleDailyAwareReplay : handleReplay}
              showLeaderboard={isGameServiceAvailable ? showLeaderboard : undefined}
              targetCircle={targetCircle}
              drawnPoints={drawnPoints}
              onBackToHome={onReturnToHome}
              onRemoveAds={onRemoveAds}
              isPenaltyMode={inPenaltyMode}
              onViewStats={handleViewStats}
              sessionRoundsPlayed={sessionStats.roundsPlayed}
              isDailyMode={isDailyMode}
              isDailyChallengeMode={isDailyChallengeMode}
              dailyCompleted={todayCompleted}
            />
          </motion.div>
        )}
        
        {gameState === 'stats' && (
          <motion.div
            key="stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <SessionStatsView 
              stats={sessionStats}
              onBack={handleBackToResults}
              onResetSession={resetSession}
              onDrawAgain={handleReplay}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational Modal */}
      <EducationalModal
        isOpen={showEducationalModal}
        onClose={handleEducationalClose}
        onContinue={() => {
          handleEducationalComplete();
          handleReplay();
        }}
      />

      {/* Blind Draw Unlock Modal */}
      <BlindDrawUnlockModal
        open={showBlindUnlockModal}
        onClose={() => {
          setShowBlindUnlockModal(false);
          markUnlockModalShown();
        }}
        onStartBlindDraw={handleStartBlindDrawFromModal}
      />
    </div>
  );
};

export default GiottoGame;