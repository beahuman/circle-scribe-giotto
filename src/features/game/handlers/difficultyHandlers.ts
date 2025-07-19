
import { GameStateProps } from '../types';

export const createDifficultyHandlers = ({
  setDifficultyLevel,
  toast,
  sessionDrawings,
  streakCount,
}: Pick<GameStateProps, 'setDifficultyLevel' | 'toast' | 'sessionDrawings' | 'streakCount'>) => {
  
  const handleDifficultyAdjustment = () => {
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
  };
  
  return { handleDifficultyAdjustment };
};
