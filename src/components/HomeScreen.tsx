import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CircleDot, Trophy, Calendar, Settings, Info, Store, History, UserCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import LogoAnimation from './LogoAnimation';
import WelcomeScreen from './WelcomeScreen';
import DailyCalibrationScreen from './DailyCalibrationScreen';

interface HomeScreenProps {
  onStart: () => void;
  showLeaderboard?: () => void;
  isGuestMode?: boolean;
  onRemoveAds?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, showLeaderboard, isGuestMode, onRemoveAds }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDailyCalibration, setShowDailyCalibration] = useState(false);

  useEffect(() => {
    // Check if the user is returning from the game
    const returningFromGame = sessionStorage.getItem('returningFromGame');
    if (returningFromGame === 'true') {
      setShowWelcome(false);
      sessionStorage.removeItem('returningFromGame');
    } else {
      // Show welcome screen on first visit or refresh
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, []);

  const handleStartDailyCalibration = () => {
    setShowDailyCalibration(true);
  };

  if (showDailyCalibration) {
    return (
      <DailyCalibrationScreen 
        onStartCalibration={() => {
          setShowDailyCalibration(false);
          onStart();
        }}
        onBack={() => setShowDailyCalibration(false)}
      />
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onStart={onStart} 
        showLeaderboard={showLeaderboard}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="space-y-2">
        <div className="w-[240px] mx-auto">
          <LogoAnimation />
        </div>
        <p className="text-muted-foreground">The art of the perfect circle</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button 
          onClick={onStart}
          className="px-8 py-6 text-lg rounded-full"
        >
          Practice Mode
        </Button>
        
        <Button 
          onClick={handleStartDailyCalibration}
          variant="outline"
          className="px-8 py-6 text-lg rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Daily Calibration
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="secondary"
            className="px-8 py-4 rounded-full"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        )}

        {!isGuestMode && (
          <Button variant="ghost" className="justify-start">
            <UserCircle className="mr-2 h-4 w-4" />
            Account
          </Button>
        )}

        <Button variant="ghost" className="justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>

        <Button variant="ghost" className="justify-start">
          <History className="mr-2 h-4 w-4" />
          History
        </Button>

        <Button variant="ghost" className="justify-start">
          <Store className="mr-2 h-4 w-4" />
          Store
        </Button>

        <Button variant="ghost" className="justify-start">
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Crafted with passion by <a href="https://twitter.com/Nutlope" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">@Nutlope</a>
      </p>
    </div>
  );
};

export default HomeScreen;
