
import { useState, useEffect } from "react";
import GiottoGame from "@/components/GiottoGame";
import HomeScreen from "@/components/HomeScreen";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Ghost } from "lucide-react";
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
    
    // Only try to initialize Game Center if we're not in guest mode
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
  
  return gameStarted ? (
    <GiottoGame onReturnToHome={() => setGameStarted(false)} />
  ) : (
    <>
      {localStorage.getItem('guestMode') && (
        <Alert className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50" style={{ backgroundColor: '#D7B1FF' }}>
          <Ghost className="h-5 w-5" style={{ color: '#765ED8' }} />
          <AlertTitle className="text-sm font-semibold mt-2">Guest Mode</AlertTitle>
          <AlertDescription className="text-sm mt-1">
            Your scores and history won't be saved and you can't connect to Game Center.
          </AlertDescription>
        </Alert>
      )}
      <HomeScreen 
        onStart={handleStartGame}
        showLeaderboard={isGameCenterAvailable ? showLeaderboard : undefined}
        isGuestMode={Boolean(localStorage.getItem('guestMode'))}
      />
    </>
  );
};

export default Index;
