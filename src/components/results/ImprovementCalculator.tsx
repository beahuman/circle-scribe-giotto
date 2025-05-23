
import { useEffect, useState } from 'react';

export const useImprovementCalculator = (roundedAccuracy: number) => {
  const [improvement, setImprovement] = useState<number | null>(null);
  
  useEffect(() => {
    try {
      const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
      if (scoreHistory.length <= 1) {
        setImprovement(null);
        return;
      }
      
      const recentScores = scoreHistory.slice(-6, -1); // Last 5 excluding current
      if (recentScores.length === 0) {
        setImprovement(null);
        return;
      }
      
      const avgRecentScore = recentScores.reduce((sum: number, item: any) => sum + item.score, 0) / recentScores.length;
      setImprovement(roundedAccuracy - avgRecentScore);
    } catch (e) {
      setImprovement(null);
    }
  }, [roundedAccuracy]);
  
  return improvement;
};
