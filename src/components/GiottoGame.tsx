
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
import ResultScreen from './ResultScreen';
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { getGameService } from '@/utils/gameServices';
import { useIsMobile } from '@/hooks/use-mobile';

type GameState = 'welcome' | 'showing' | 'drawing' | 'result';

const GiottoGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [accuracy, setAccuracy] = useState(0);
  const [targetCircle, setTargetCircle] = useState(generateRandomCirclePosition());
  const [isGameServiceAvailable, setIsGameServiceAvailable] = useState(false);
  const [bypassMobileCheck, setBypassMobileCheck] = useState(false);
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
  
  const handleStart = () => {
    setTargetCircle(generateRandomCirclePosition());
    setGameState('showing');
  };
  
  const handleCircleMemorized = () => {
    setGameState('drawing');
  };
  
  const handleDrawingComplete = async (score: number) => {
    setAccuracy(score);
    setGameState('result');
    
    // Submit score to game service if available
    if (isGameServiceAvailable) {
      try {
        const service = await getGameService();
        await service.submitScore(score);
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    }
  };
  
  const handleReplay = () => {
    setGameState('welcome');
  };

  const handleBypassMobile = () => {
    setBypassMobileCheck(true);
    handleStart();
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
  
  // Add warning for non-mobile devices
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
      {gameState === 'welcome' && (
        <WelcomeScreen onStart={handleStart} showLeaderboard={isGameServiceAvailable ? showLeaderboard : undefined} />
      )}
      
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
          onReplay={handleReplay}
          showLeaderboard={isGameServiceAvailable ? showLeaderboard : undefined}
        />
      )}
    </div>
  );
};

export default GiottoGame;
