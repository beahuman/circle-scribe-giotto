
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
        console.log("Game service initialized: ", signedIn ? "SUCCESS" : "FAILED");
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
        console.log(`Score ${score} submitted to Game Center`);
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    } else {
      console.log("Game service not available. Score not submitted.");
    }
  };
  
  const showLeaderboard = async () => {
    if (isGameServiceAvailable) {
      try {
        const service = await getGameService();
        await service.showLeaderboard();
        console.log("Showing Game Center leaderboard");
      } catch (error) {
        console.error("Failed to show leaderboard:", error);
      }
    } else {
      console.log("Game service not available. Cannot show leaderboard.");
    }
  };
  
  return { 
    isGameServiceAvailable, 
    submitScore,
    showLeaderboard
  };
};
