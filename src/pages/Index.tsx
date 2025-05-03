
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
    
    if (!localStorage.getItem('guestMode')) {
      initializeGameCenter();
    }
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
  
  const handleRemoveAds = () => {
    console.log('Remove ads clicked - to be implemented');
  };
  
  return (
    <div className="min-h-screen pb-16 overflow-y-auto">
      {gameStarted ? (
        <GiottoGame 
          onReturnToHome={() => setGameStarted(false)} 
          onRemoveAds={handleRemoveAds}
        />
      ) : (
        <HomeScreen 
          onStart={handleStartGame}
          showLeaderboard={isGameCenterAvailable ? showLeaderboard : undefined}
          isGuestMode={Boolean(localStorage.getItem('guestMode'))}
          onRemoveAds={handleRemoveAds}
        />
      )}
    </div>
  );
};

export default Index;
