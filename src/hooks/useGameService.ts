
import { useEffect, useState } from 'react';
import { getGameService } from '@/utils/gameServices';

export const useGameService = () => {
  const [isGameServiceAvailable, setIsGameServiceAvailable] = useState(false);
  
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
  
  const submitScore = async (score: number) => {
    if (isGameServiceAvailable) {
      try {
        const service = await getGameService();
        await service.submitScore(score);
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    }
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
  
  return { 
    isGameServiceAvailable, 
    submitScore,
    showLeaderboard
  };
};
