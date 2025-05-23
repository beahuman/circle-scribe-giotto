
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { Point } from '@/types/shapes';
import { GameStateProps } from '../types';

export const createCoreHandlers = ({
  setGameState,
  setAccuracy,
  setDrawnPoints,
  setTargetCircle,
}: Pick<GameStateProps, 'setGameState' | 'setAccuracy' | 'setDrawnPoints' | 'setTargetCircle'>) => {
  
  const handleCircleMemorized = () => {
    // Immediate state transition
    setGameState('drawing');
  };

  const handleDrawingComplete = (score: number, points: Point[]) => {
    // All state updates happen synchronously for immediate feedback
    setAccuracy(score);
    setDrawnPoints(points);
    setGameState('result');
  };

  const handleBypassMobile = () => {
    setGameState('showing');
  };

  return {
    handleCircleMemorized,
    handleDrawingComplete,
    handleBypassMobile,
  };
};
