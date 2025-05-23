
import { useToast } from "@/hooks/use-toast";
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { Point } from '@/types/shapes';
import { PenaltyShape } from "@/types/game";

interface GameStateProps {
  setGameState: (state: 'showing' | 'drawing' | 'result' | 'penalty') => void;
  setAccuracy: (accuracy: number) => void;
  setDrawnPoints: (points: Point[]) => void;
  setSessionDrawings: (callback: (prev: number) => number) => void;
  setStreakCount: (callback: (prev: number) => number) => void;
  setConsecutiveLowScores: (callback: (prev: number) => number) => void;
  setTargetCircle: (circle: { x: number, y: number, radius: number }) => void;
  setDifficultyLevel: (difficulty: number) => void;
  setCurrentPenaltyShape: (shape: PenaltyShape) => void;
  setCompletedPenaltyShapes: (count: number) => void;
  submitScore: (score: number) => Promise<void>;
  toast: ReturnType<typeof useToast>['toast'];
  difficultyLevel: number;
  streakCount: number;
  sessionDrawings: number;
  consecutiveLowScores: number;
  completedPenaltyShapes: number;
  gameState: string;
  currentPenaltyShape: PenaltyShape;
}

export const useGameHandlers = ({
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
}: GameStateProps) => {
  
  const handleCircleMemorized = () => {
    setGameState('drawing');
  };

  const handleDrawingComplete = async (score: number, points: Point[]) => {
    setAccuracy(score);
    setDrawnPoints(points);
    setGameState('result');
    setSessionDrawings(prev => prev + 1);
    
    // Track streak for reinforcement (consecutive good scores)
    if (score >= 75) {
      setStreakCount(prev => prev + 1);
      
      // Give positive feedback on streaks (reinforcement)
      if (streakCount === 2) {
        toast({
          title: "You're on a streak!",
          description: "Your brain is forming new neural pathways.",
          duration: 3000
        });
      } else if (streakCount === 5) {
        toast({
          title: "Impressive streak!",
          description: "Your motor cortex is getting optimized.",
          duration: 3000
        });
      } else if (streakCount >= 10 && streakCount % 5 === 0) {
        toast({
          title: `${streakCount} streak! Amazing!`,
          description: "You're developing expert-level muscle memory!",
          duration: 3000
        });
      }
    } else {
      // Reset streak on poor performance
      if (streakCount >= 3) {
        toast({
          title: "Streak ended",
          description: "Take a breath and try again.",
          duration: 2000
        });
      }
      setStreakCount(0);
    }
    
    // Track consecutive low scores for the penalty system
    if (score < 30) {
      setConsecutiveLowScores(prev => prev + 1);
      
      // Neural feedback on repeated poor performance
      if (consecutiveLowScores === 2) {
        toast({
          title: "Struggling with circles?",
          description: "Let's try something different to build your skills.",
          duration: 3000
        });
      }
    } else {
      setConsecutiveLowScores(0);
    }
    
    // Adaptive difficulty - if player is consistently doing well, subtly increase difficulty
    if (sessionDrawings >= 5 && streakCount >= 3) {
      const storedDifficulty = Number(localStorage.getItem('difficultyLevel')) || 50;
      if (storedDifficulty < 95) {
        const newDifficulty = Math.min(95, storedDifficulty + 5);
        localStorage.setItem('difficultyLevel', String(newDifficulty));
        setDifficultyLevel(newDifficulty);
        
        if (newDifficulty - storedDifficulty >= 5) {
          // Only notify if difficulty actually increased
          toast({
            title: "Skill improving!",
            description: "Challenge level subtly increased.",
            duration: 2000
          });
        }
      }
    }
    
    await submitScore(score);
  };

  const handlePenaltyComplete = (score: number) => {
    console.log(`Shape challenge completed with score: ${score}`);
    
    // If score is good enough
    if (score >= 50) {
      // Increment completed shapes counter
      const newCompletedShapes = completedPenaltyShapes + 1;
      setCompletedPenaltyShapes(newCompletedShapes);
      
      // If player completed all three penalty shapes, reset and go back to circles
      if (newCompletedShapes >= 3) {
        setCompletedPenaltyShapes(0);
        setConsecutiveLowScores(0);
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
        description: `${newCompletedShapes}/3 training shapes completed.`,
        duration: 2000
      });
    }
  };
  
  const handleReplay = () => {
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
      }
      return;
    }
    
    // Normal circle drawing continues
    setTargetCircle(generateRandomCirclePosition());
    setGameState('showing');
    setDrawnPoints([]); // Clear previous drawing
  };
  
  const handleBypassMobile = () => {
    setGameState('showing');
  };

  return {
    handleCircleMemorized,
    handleDrawingComplete,
    handlePenaltyComplete,
    handleReplay,
    handleBypassMobile
  };
};
