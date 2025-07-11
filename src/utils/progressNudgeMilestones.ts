import { GameResult, ProgressStats } from '@/hooks/useLocalProgress';
import { MilestoneType } from '@/types/progressNudge';

export const checkMilestoneForScore = (
  currentScore: number, 
  gameResults: GameResult[], 
  stats: ProgressStats
): MilestoneType | null => {
  if (gameResults.length === 0) return null;
  
  // Check for new best score
  if (currentScore > stats.bestScore) {
    return 'new_best';
  }
  
  // Check for score improvement (better than last attempt)
  const lastScore = gameResults[0]?.score || 0;
  if (currentScore > lastScore && currentScore >= 70) { // Show only for decent scores
    return 'score_improvement';
  }
  
  // Check for streak broken (previous games had better scores)
  const recentScores = gameResults.slice(0, 3).map(r => r.score);
  const averageRecent = recentScores.length > 0 ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
  if (currentScore < averageRecent * 0.8 && averageRecent > 60) { // Significant drop
    return 'streak_broken';
  }
  
  return null;
};