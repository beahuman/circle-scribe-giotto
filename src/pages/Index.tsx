
import { useState, useEffect } from "react";
import GiottoGame from "@/components/GiottoGame";
import HomeScreen from "@/components/HomeScreen";
import { getGameService } from '@/utils/gameServices';

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
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
  
  const handleStartGame = () => {
    setGameStarted(true);
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
  
  return gameStarted ? (
    <GiottoGame onReturnToHome={() => setGameStarted(false)} />
  ) : (
    <HomeScreen 
      onStartGame={handleStartGame}
      showLeaderboard={isGameServiceAvailable ? showLeaderboard : undefined}
    />
  );
};

export default Index;
