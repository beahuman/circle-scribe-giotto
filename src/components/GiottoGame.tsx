import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
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
import { Point } from '@/types/shapes';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';

const GiottoGame: React.FC<GameProps> = ({ onReturnToHome, onRemoveAds }) => {
  // Educational modal state
  const [showEducationalModal, setShowEducationalModal] = useState(false);
  const [pendingGameState, setPendingGameState] = useState<'showing' | null>(null);

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
  const { sessionStats, recordRound, resetSession } = useSessionStats();
  
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
  const { todayCompleted, recordDailyAccuracy } = useDailyCalibration();
  
  // Check if we're in daily calibration mode or daily challenge mode
  const isDailyMode = new URLSearchParams(window.location.search).get('daily') === 'true';
  const isDailyChallengeMode = new URLSearchParams(window.location.search).get('mode') === 'daily-challenge';
  
  // Enhanced drawing complete handler to record round stats and daily calibration
  const handleEnhancedDrawingComplete = async (score: number, points: Point[]) => {
    // Record the round in session stats
    recordRound(score);
    
    // If in daily mode, record daily accuracy and prevent retries
    if (isDailyMode) {
      const success = recordDailyAccuracy(score);
      if (success) {
        // In daily mode, we don't allow retries
        console.log('Daily calibration recorded:', score);
      }
    }
    
    // If in daily challenge mode, handle completion differently
    if (isDailyChallengeMode) {
      // Record daily challenge completion
      // This will be handled by the daily challenge hook
      console.log('Daily challenge completed:', score);
    }
    
    // Call the original handler
    await handleDrawingComplete(score, points);
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

    // Show educational modal every 3rd round (after first completion) - but not in daily modes
    const shouldShowEducational = sessionDrawings > 0 && (sessionDrawings + 1) % 3 === 0 && !isDailyMode && !isDailyChallengeMode;
    
    if (shouldShowEducational && !isDailyMode && !isDailyChallengeMode) {
      setPendingGameState('showing');
      setShowEducationalModal(true);
    } else {
      handleReplay();
    }
  };

  // Handle educational modal completion
  const handleEducationalComplete = () => {
    setShowEducationalModal(false);
    if (pendingGameState) {
      handleReplay();
      setPendingGameState(null);
    }
  };

  const handleEducationalClose = () => {
    setShowEducationalModal(false);
    setPendingGameState(null);
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
  
  // Render the current game state
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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
            <DrawingCanvas 
              onComplete={handleEnhancedDrawingComplete}
              targetCircle={targetCircle}
              difficultyLevel={inPenaltyMode ? Math.min(difficultyLevel + 20, 100) : difficultyLevel}
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
        onContinue={handleEducationalComplete}
      />
    </div>
  );
};

export default GiottoGame;
