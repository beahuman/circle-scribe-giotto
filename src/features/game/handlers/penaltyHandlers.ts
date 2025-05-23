
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { PenaltyShape } from '@/types/game';
import { GameStateProps } from '../types';

export const createPenaltyHandlers = ({
  setGameState,
  setConsecutiveLowScores,
  setCurrentPenaltyShape,
  setCompletedPenaltyShapes,
  setTargetCircle,
  setDrawnPoints,
  toast,
  consecutiveLowScores,
  completedPenaltyShapes,
  currentPenaltyShape,
  gameState,
}: Pick<GameStateProps, 
  'setGameState' | 
  'setConsecutiveLowScores' | 
  'setCurrentPenaltyShape' | 
  'setCompletedPenaltyShapes' | 
  'setTargetCircle' | 
  'setDrawnPoints' | 
  'toast' | 
  'consecutiveLowScores' | 
  'completedPenaltyShapes' | 
  'currentPenaltyShape' |
  'gameState'
>) => {
  
  const handlePenaltyComplete = (score: number) => {
    console.log(`Shape challenge completed with score: ${score}`);
    
    // If score is good enough
    if (score >= 50) {
      // Increment completed shapes counter
      setCompletedPenaltyShapes(prev => prev + 1);
      
      // If player completed all three penalty shapes, reset and go back to circles
      if (completedPenaltyShapes + 1 >= 3) {
        setCompletedPenaltyShapes(() => 0);
        setConsecutiveLowScores(() => 0);
        setCurrentPenaltyShape(null);
        setGameState('showing');
        setTargetCircle(generateRandomCirclePosition());
        
        // Positive reinforcement for completing training
        toast({
          title: "Training complete!",
          description: "Let's see if your circles improve now!",
          duration: 3000
        });
        return;
      }
      
      // Rotate to the next shape
      const shapes: PenaltyShape[] = ['line', 'triangle', 'square'];
      const currentIndex = shapes.indexOf(currentPenaltyShape || 'line');
      const nextIndex = (currentIndex + 1) % shapes.length;
      setCurrentPenaltyShape(shapes[nextIndex]);
      
      // Encourage progress
      toast({
        title: "Shape mastered!",
        description: `${completedPenaltyShapes + 1}/3 training shapes completed.`,
        duration: 2000
      });
    }
  };
  
  const checkForPenaltyMode = () => {
    // Check if the player should be in penalty mode
    if (consecutiveLowScores >= 3 && completedPenaltyShapes < 3) {
      // Start penalty mode with the first shape if not already in it
      if (gameState !== 'penalty') {
        setCurrentPenaltyShape('line');
        setGameState('penalty');
        setDrawnPoints([]); // Clear previous drawing
        
        // Educational moment
        toast({
          title: "Shape Training Mode",
          description: "Mastering basic shapes will help improve your circle drawing.",
          duration: 4000
        });
        return true;
      }
    }
    return false;
  };
  
  return { handlePenaltyComplete, checkForPenaltyMode };
};
