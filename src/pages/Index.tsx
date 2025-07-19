import { useState, useEffect } from "react";
import GiottoGame from "@/components/GiottoGame";
import HomeScreen from "@/components/HomeScreen";
import { getGameService } from '@/utils/gameServices';
import { useToast } from "@/hooks/use-toast";
const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [isGameCenterAvailable, setIsGameCenterAvailable] = useState(false);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const initializeGameCenter = async () => {
      try {
        const service = await getGameService();
        const signedIn = await service.signIn();
        setIsGameCenterAvailable(signedIn);
        if (signedIn) {
          console.log("Game Center initialized successfully");
        }
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
        toast({
          title: "Couldn't load leaderboard",
          description: "Please try again later",
          duration: 3000
        });
      }
    } else {
      toast({
        title: "Game Center unavailable",
        description: "Please sign in to Game Center in your device settings",
        duration: 3000
      });
    }
  };
  const handleRemoveAds = () => {
    console.log('Remove ads clicked - to be implemented');
    toast({
      title: "Premium Feature",
      description: "Ad-free experience coming soon!",
      duration: 3000
    });
  };
  return <div className="min-h-screen pb-16 overflow-y-auto bg-background">
      {gameStarted ? <GiottoGame onReturnToHome={() => setGameStarted(false)} onRemoveAds={handleRemoveAds} /> : <HomeScreen onStart={handleStartGame} showLeaderboard={isGameCenterAvailable ? showLeaderboard : undefined} isGuestMode={Boolean(localStorage.getItem('guestMode'))} onRemoveAds={handleRemoveAds} />}
    </div>;
};
export default Index;