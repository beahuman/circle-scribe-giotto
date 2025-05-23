
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { GameStateProps } from '../types';

export const createPenaltyHandlers = ({
  setGameState,
  setConsecutiveLowScores,
  setTargetCircle,
  setDrawnPoints,
  toast,
  consecutiveLowScores,
  penaltyModeEnabled,
}: Pick<GameStateProps, 
  'setGameState' | 
  'setConsecutiveLowScores' | 
  'setTargetCircle' | 
  'setDrawnPoints' | 
  'toast' | 
  'consecutiveLowScores' |
  'penaltyModeEnabled'
>) => {
  
  const checkForPenaltyMode = () => {
    // Always in penalty mode if enabled in settings
    if (penaltyModeEnabled) {
      // Apply smaller circle
      const newCircle = generateRandomCirclePosition();
      newCircle.radius = Math.floor(newCircle.radius * 0.8); // 20% smaller
      
      setTargetCircle(newCircle);
      setGameState('showing');
      setDrawnPoints([]); // Clear previous drawing
      return true;
    }
    
    // Check if the player should be in penalty mode based on score history
    if (consecutiveLowScores >= 3) {
      // Enter penalty mode with smaller circle
      const newCircle = generateRandomCirclePosition();
      newCircle.radius = Math.floor(newCircle.radius * 0.8); // 20% smaller
      
      setTargetCircle(newCircle);
      setGameState('showing');
      setDrawnPoints([]); // Clear previous drawing
      
      // Notify the user about penalty mode
      toast({
        title: "Penalty Mode Activated!",
        description: "Three poor scores in a row? Time to prove yourself with smaller circles!",
        duration: 4000
      });
      return true;
    }
    return false;
  };
  
  return { 
    checkForPenaltyMode
  };
};
