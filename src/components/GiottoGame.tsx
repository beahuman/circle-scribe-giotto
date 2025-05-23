import React, { useState, useEffect } from 'react';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
import ResultScreen from './ResultScreen';
import ShapeChallenge from './ShapeChallenge';
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { getGameService } from '@/utils/gameServices';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShapeType } from '@/types/shapes';
import { useToast } from "@/hooks/use-toast";

type GameState = 'showing' | 'drawing' | 'result' | 'penalty';
type PenaltyShape = 'line' | 'triangle' | 'square' | null;

interface GiottoGameProps {
  onReturnToHome?: () => void;
  onRemoveAds?: () => void;
}

const GiottoGame: React.FC<GiottoGameProps> = ({ onReturnToHome, onRemoveAds }) => {
  const [gameState, setGameState] = useState<GameState>('showing');
  const [accuracy, setAccuracy] = useState(0);
  const [targetCircle, setTargetCircle] = useState(generateRandomCirclePosition());
  const [isGameServiceAvailable, setIsGameServiceAvailable] = useState(false);
  const [bypassMobileCheck, setBypassMobileCheck] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [difficultyLevel, setDifficultyLevel] = useState(() => {
    return Number(localStorage.getItem('difficultyLevel')) || 50;
  });
  const [displayDuration, setDisplayDuration] = useState(() => {
    return Number(localStorage.getItem('displayDuration')) || 3;
  });
  const [consecutiveLowScores, setConsecutiveLowScores] = useState(0);
  const [currentPenaltyShape, setCurrentPenaltyShape] = useState<PenaltyShape>(null);
  const [completedPenaltyShapes, setCompletedPenaltyShapes] = useState(0);
  const [sessionDrawings, setSessionDrawings] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Track session statistics for neuroplasticity-inspired feedback
  useEffect(() => {
    const lastSession = localStorage.getItem('lastSession');
    const today = new Date().toDateString();
    
    if (lastSession !== today) {
      // New day, new session
      localStorage.setItem('lastSession', today);
      
      // Check if they've been practicing regularly
      const sessionsThisWeek = Number(localStorage.getItem('sessionsThisWeek') || '0');
      if (sessionsThisWeek > 0) {
        toast({
          title: "Welcome back!",
          description: "Regular practice builds stronger neural pathways.",
          duration: 3000
        });
      }
      
      localStorage.setItem('sessionsThisWeek', String(sessionsThisWeek + 1));
    }
  }, [toast]);
  
  useEffect(() => {
    const initializeGameService = async () => {
      try {
        const service = await getGameService();
        const signedIn = await service.signIn();
        setIsGameServiceAvailable(signedIn);
      } catch (error) {
        console.error("Failed to initialize game service:", error);
        setIsGameServiceAvailable(false);
      }
    };
    
    initializeGameService();
  }, []);
  
  const handleCircleMemorized = () => {
    setGameState('drawing');
  };
  
  const handleDrawingComplete = async (score: number, points: Array<{ x: number; y: number }>) => {
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
    
    if (isGameServiceAvailable) {
      try {
        const service = await getGameService();
        await service.submitScore(score);
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    }
  };

  const handlePenaltyComplete = (score: number) => {
    console.log(`Shape challenge completed with score: ${score}`);
    
    // If score is good enough
    if (score >= 50) {
      // Increment completed shapes counter
      const newCompletedShapes = completedPenaltyShapes + 1;
      setCompletedPenaltyShapes(newCompletedShapes);
      
      // Clear drawn points in between shape challenges
      setDrawnPoints([]);
      
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
    setBypassMobileCheck(true);
    setGameState('showing');
  };
  
  const showLeaderboard = async () => {
    if (isGameServiceAvailable) {
      try {
        const service = await getGameService();
        await service.showLeaderboard();
      } catch (error) {
        console.error("Failed to show leaderboard:", error);
      }
    }
  };
  
  if (!isMobile && !bypassMobileCheck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Giotto</h1>
        <p className="text-lg mb-8">This game is designed for touch devices. Please open it on a mobile device for the best experience.</p>
        <button 
          onClick={handleBypassMobile} 
          className="px-6 py-3 bg-primary text-white rounded-full"
        >
          Continue Anyway
        </button>
      </div>
    );
  }
  
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
