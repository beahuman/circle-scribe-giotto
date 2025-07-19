
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { Point } from '@/types/shapes';
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
    setTargetCircle,
    penaltyModeEnabled
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
    setTargetCircle,
    setDrawnPoints,
    toast: props.toast,
    consecutiveLowScores: props.consecutiveLowScores,
    penaltyModeEnabled: props.penaltyModeEnabled
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
    const newCircle = generateRandomCirclePosition();
    
    // If in penalty mode (either automatic or enabled), reduce circle size by 20%
    if (penaltyModeEnabled || props.consecutiveLowScores >= 3) {
      newCircle.radius = Math.floor(newCircle.radius * 0.8);
    }
    
    setTargetCircle(newCircle);
    setGameState('showing');
    setDrawnPoints([]); // Clear previous drawing
  };
  
  return {
    ...coreHandlers,
    handleDrawingComplete,
    handleReplay,
    isPenaltyMode: () => penaltyModeEnabled || props.consecutiveLowScores >= 3
  };
};
