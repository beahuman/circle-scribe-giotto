
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { getGameService } from '@/utils/gameServices';
import { Point } from '@/types/shapes';
import { useLocalProgress } from './useLocalProgress';

type GameState = 'showing' | 'drawing' | 'result' | 'penalty' | 'stats';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>('showing');
  const [accuracy, setAccuracy] = useState(0);
  const [targetCircle, setTargetCircle] = useState(generateRandomCirclePosition());
  const [isGameServiceAvailable, setIsGameServiceAvailable] = useState(false);
  const [bypassMobileCheck, setBypassMobileCheck] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [difficultyLevel, setDifficultyLevel] = useState(() => {
    return Number(localStorage.getItem('difficultyLevel')) || 50;
  });
  const [displayDuration, setDisplayDuration] = useState(() => {
    return Number(localStorage.getItem('displayDuration')) || 3;
  });
  const [consecutiveLowScores, setConsecutiveLowScores] = useState(0);
  const [penaltyModeEnabled, setPenaltyModeEnabled] = useState(() => {
    return localStorage.getItem('penaltyModeEnabled') === 'true';
  });
  const [sessionDrawings, setSessionDrawings] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const { toast } = useToast();
  const { addGameResult } = useLocalProgress();
  
  // Create a wrapped setAccuracy that also records the result
  const setAccuracyWithTracking = (newAccuracy: number) => {
    // Set accuracy immediately without any delays
    setAccuracy(newAccuracy);
    
    // Record the result for local progress tracking synchronously
    addGameResult(
      Math.round(newAccuracy), 
      difficultyLevel, 
      penaltyModeEnabled || consecutiveLowScores >= 3
    );
  };
  
  return {
    gameState,
    setGameState,
    accuracy,
    setAccuracy: setAccuracyWithTracking,
    targetCircle,
    setTargetCircle,
    isGameServiceAvailable, 
    setIsGameServiceAvailable,
    bypassMobileCheck,
    setBypassMobileCheck,
    drawnPoints,
    setDrawnPoints,
    difficultyLevel,
    setDifficultyLevel,
    displayDuration,
    setDisplayDuration,
    consecutiveLowScores,
    setConsecutiveLowScores,
    penaltyModeEnabled,
    setPenaltyModeEnabled,
    sessionDrawings,
    setSessionDrawings,
    streakCount,
    setStreakCount,
    toast
  };
};
