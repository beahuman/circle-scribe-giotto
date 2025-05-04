import React, { useState, useEffect } from 'react';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
import ResultScreen from './ResultScreen';
import ShapeChallenge from './ShapeChallenge';
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { getGameService } from '@/utils/gameServices';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShapeType } from '@/types/shapes';

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
  const [consecutiveLowScores, setConsecutiveLowScores] = useState(0);
  const [currentPenaltyShape, setCurrentPenaltyShape] = useState<PenaltyShape>(null);
  const [completedPenaltyShapes, setCompletedPenaltyShapes] = useState(0);
  const isMobile = useIsMobile();
  
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
    
    // Track consecutive low scores for the penalty system
    if (score < 30) {
      setConsecutiveLowScores(prev => prev + 1);
    } else {
      setConsecutiveLowScores(0);
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
      
      // If player completed all three penalty shapes, reset and go back to circles
      if (newCompletedShapes >= 3) {
        setCompletedPenaltyShapes(0);
        setConsecutiveLowScores(0);
        handleReplay();
        return;
      }
      
      // Rotate to the next shape
      const shapes: PenaltyShape[] = ['line', 'triangle', 'square'];
      const currentIndex = shapes.indexOf(currentPenaltyShape || 'line');
      const nextIndex = (currentIndex + 1) % shapes.length;
      setCurrentPenaltyShape(shapes[nextIndex]);
    }
    
    // Show the next penalty shape challenge (or retry the same one if failed)
    // We don't need to update gameState here since it's already 'penalty'
  };
  
  const handleReplay = () => {
    // Check if the player should be in penalty mode
    if (consecutiveLowScores >= 3 && completedPenaltyShapes < 3) {
      // Start penalty mode with the first shape if not already in it
      if (gameState !== 'penalty') {
        setCurrentPenaltyShape('line');
        setGameState('penalty');
      }
      return;
    }
    
    // Normal circle drawing continues
    setTargetCircle(generateRandomCirclePosition());
    setGameState('showing');
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
          duration={3} 
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
