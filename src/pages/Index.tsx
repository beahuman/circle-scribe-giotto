
import { useState, useEffect } from "react";
import GiottoGame from "@/components/GiottoGame";
import HomeScreen from "@/components/HomeScreen";
import { getGameService } from '@/utils/gameServices';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameCenterAvailable, setIsGameCenterAvailable] = useState(false);
  
  useEffect(() => {
    const initializeGameCenter = async () => {
      try {
        const service = await getGameService();
        const signedIn = await service.signIn();
        setIsGameCenterAvailable(signedIn);
      } catch (error) {
        console.error("Failed to initialize Game Center:", error);
        setIsGameCenterAvailable(false);
      }
    };
    
    initializeGameCenter();
  }, []);
  
  const handleStartGame = () => {
    setGameStarted(true);
  };
  
  const showLeaderboard = async () => {
    if (isGameCenterAvailable) {
      try {
        const service = await getGameService();
        await service.showLeaderboard();
      } catch (error) {
        console.error("Failed to show Game Center leaderboard:", error);
      }
    }
  };
  
  return gameStarted ? (
    <GiottoGame onReturnToHome={() => setGameStarted(false)} />
  ) : (
    <HomeScreen 
      onStartGame={handleStartGame}
      showLeaderboard={isGameCenterAvailable ? showLeaderboard : undefined}
    />
  );
};

export default Index;
