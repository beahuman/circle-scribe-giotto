
import React from 'react';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
import ResultScreen from './ResultScreen';
import ShapeChallenge from './ShapeChallenge';
import { useIsMobile } from '@/hooks/use-mobile';
import { GameProps } from '@/types/game';
import { useGameState } from '@/hooks/useGameState';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import { useGameService } from '@/hooks/useGameService';
import { useGameHandlers } from '@/features/game/gameHandlers';
import MobileWarning from './game/MobileWarning';

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
    currentPenaltyShape,
    setCurrentPenaltyShape,
    completedPenaltyShapes,
    setCompletedPenaltyShapes,
    sessionDrawings,
    setSessionDrawings,
    streakCount,
    setStreakCount,
    toast
  } = useGameState();
  
  // Track session for neuroplasticity feedback
  useSessionTracking();
  
  // Game service for leaderboard and score submission
  const { isGameServiceAvailable, submitScore, showLeaderboard } = useGameService();
  
  // Game interaction handlers
  const {
    handleCircleMemorized,
    handleDrawingComplete,
    handlePenaltyComplete,
    handleReplay,
    handleBypassMobile
  } = useGameHandlers({
    setGameState,
    setAccuracy,
    setDrawnPoints,
    setSessionDrawings,
    setStreakCount,
    setConsecutiveLowScores,
    setTargetCircle,
    setDifficultyLevel,
    setCurrentPenaltyShape,
    setCompletedPenaltyShapes,
    submitScore,
    toast,
    difficultyLevel,
    streakCount,
    sessionDrawings,
    consecutiveLowScores,
    completedPenaltyShapes,
    gameState,
    currentPenaltyShape
  });
  
  const isMobile = useIsMobile();
  
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
  
  // Render the current game state
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {gameState === 'showing' && (
        <CircleDisplay 
          duration={displayDuration} 
          onComplete={handleCircleMemorized}
          circleProps={targetCircle}
        />
      )}
      
      {gameState === 'drawing' && (
        <DrawingCanvas 
          onComplete={handleDrawingComplete}
          targetCircle={targetCircle}
        />
      )}
      
      {gameState === 'result' && (
        <ResultScreen 
          accuracy={accuracy}
          difficultyLevel={difficultyLevel}
          onReplay={handleReplay}
          showLeaderboard={isGameServiceAvailable ? showLeaderboard : undefined}
          targetCircle={targetCircle}
          drawnPoints={drawnPoints}
          onBackToHome={onReturnToHome}
          onRemoveAds={onRemoveAds}
          isPenaltyMode={consecutiveLowScores >= 3}
          penaltyShapesRequired={3}
          penaltyShapesCompleted={completedPenaltyShapes}
        />
      )}

      {gameState === 'penalty' && currentPenaltyShape && (
        <ShapeChallenge 
          shapeType={currentPenaltyShape}
          onComplete={handlePenaltyComplete}
          difficultyLevel={difficultyLevel}
          completedShapes={completedPenaltyShapes}
          totalShapesRequired={3}
        />
      )}
    </div>
  );
};

export default GiottoGame;
