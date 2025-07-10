
import { GameStateProps } from '../types';

export const createStreakHandlers = ({
  setSessionDrawings,
  setStreakCount,
  setConsecutiveLowScores,
  submitScore,
  toast,
  streakCount
}: Pick<GameStateProps, 'setSessionDrawings' | 'setStreakCount' | 'setConsecutiveLowScores' | 'submitScore' | 'toast' | 'streakCount'>) => {
  
  const handleStreakTracking = async (score: number) => {
    setSessionDrawings(prev => prev + 1);
    
    // Track streak for reinforcement (consecutive good scores)
    if (score >= 75) {
      setStreakCount(prev => prev + 1);
      
      // Reset consecutive low scores when performing well
      setConsecutiveLowScores(() => 0); // Using callback pattern
      
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
      setStreakCount(() => 0); // Using callback pattern
    }
    
    // Track consecutive low scores for the penalty system
    if (score < 50) {
      setConsecutiveLowScores(prev => prev + 1);
      
      // Check consecutive low scores for warning - using a simple counter instead
      setConsecutiveLowScores(prevCount => {
        if (prevCount === 2) {
          toast({
            title: "Warning",
            description: "One more low score and you'll enter Penalty Mode!",
            duration: 3000
          });
        }
        return prevCount;
      });
    } else {
      setConsecutiveLowScores(() => 0); // Using callback pattern
    }
    
    await submitScore(score);
  };
  
  return { handleStreakTracking };
};
