
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { GameStateProps, GameHandlers } from './types';
import { createCoreHandlers } from './handlers/coreHandlers';
import { createStreakHandlers } from './handlers/streakHandlers';
import { createDifficultyHandlers } from './handlers/difficultyHandlers';
import { createPenaltyHandlers } from './handlers/penaltyHandlers';

export const useGameHandlers = (props: GameStateProps): GameHandlers => {
  const { 
    setGameState, 
    setAccuracy, 
    setDrawnPoints, 
    setTargetCircle
  } = props;
  
  // Initialize the handlers
  const coreHandlers = createCoreHandlers({
    setGameState,
    setAccuracy,
    setDrawnPoints,
    setTargetCircle
  });
  
  const streakHandlers = createStreakHandlers({
    setSessionDrawings: props.setSessionDrawings,
    setStreakCount: props.setStreakCount,
    setConsecutiveLowScores: props.setConsecutiveLowScores,
    submitScore: props.submitScore,
    toast: props.toast,
    streakCount: props.streakCount
  });
  
  const difficultyHandlers = createDifficultyHandlers({
    setDifficultyLevel: props.setDifficultyLevel,
    toast: props.toast,
    sessionDrawings: props.sessionDrawings,
    streakCount: props.streakCount
  });
  
  const penaltyHandlers = createPenaltyHandlers({
    setGameState,
    setConsecutiveLowScores: props.setConsecutiveLowScores,
    setCurrentPenaltyShape: props.setCurrentPenaltyShape,
    setCompletedPenaltyShapes: props.setCompletedPenaltyShapes,
    setTargetCircle,
    setDrawnPoints,
    toast: props.toast,
    consecutiveLowScores: props.consecutiveLowScores,
    completedPenaltyShapes: props.completedPenaltyShapes,
    currentPenaltyShape: props.currentPenaltyShape,
    gameState: props.gameState
  });

  // Create the combined handlers with extended functionality
  const handleDrawingComplete = async (score: number, points: Point[]) => {
    // First, use the core handler for basic functionality
    await coreHandlers.handleDrawingComplete(score, points);
    
    // Then handle streak tracking and feedback
    await streakHandlers.handleStreakTracking(score);
    
    // Handle difficulty adjustment
    difficultyHandlers.handleDifficultyAdjustment();
  };
  
  const handleReplay = () => {
    // Check if we should enter penalty mode
    if (penaltyHandlers.checkForPenaltyMode()) {
      return;
    }
    
    // Normal circle drawing continues
    setTargetCircle(generateRandomCirclePosition());
    setGameState('showing');
    setDrawnPoints([]); // Clear previous drawing
  };
  
  return {
    ...coreHandlers,
    handleDrawingComplete,
    handlePenaltyComplete: penaltyHandlers.handlePenaltyComplete,
    handleReplay
  };
};
