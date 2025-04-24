
import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import CircleDisplay from './CircleDisplay';
import DrawingCanvas from './DrawingCanvas';
import ResultScreen from './ResultScreen';
import { generateRandomCirclePosition } from '@/utils/circleUtils';

type GameState = 'welcome' | 'showing' | 'drawing' | 'result';

const GiottoGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [accuracy, setAccuracy] = useState(0);
  const [targetCircle, setTargetCircle] = useState(generateRandomCirclePosition());
  
  const handleStart = () => {
    setTargetCircle(generateRandomCirclePosition());
    setGameState('showing');
  };
  
  const handleCircleMemorized = () => {
    setGameState('drawing');
  };
  
  const handleDrawingComplete = (score: number) => {
    setAccuracy(score);
    setGameState('result');
  };
  
  const handleReplay = () => {
    setGameState('welcome');
  };
  
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {gameState === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
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
        />
      )}
    </div>
  );
};

export default GiottoGame;
