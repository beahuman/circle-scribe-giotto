
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';

interface HomeScreenProps {
  onStartGame: () => void;
  showLeaderboard?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, showLeaderboard }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="p-4 flex justify-between items-center">
        <div className="w-10" /> {/* Placeholder to maintain layout */}
        <div className="w-10" /> {/* Placeholder to maintain layout */}
      </header>
      
      <div className="flex-1 flex flex-col items-center justify-center gap-12 p-6 text-center pb-24">
        <div className="space-y-4 max-w-xs text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Giotto
          </h1>
          <p className="text-lg text-muted-foreground">Can you draw a perfect circle?</p>
        </div>
        
        <div className="relative mb-8">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border-4 border-primary/20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-dashed border-2 border-primary/40"></div>
          <div className="w-44 h-44 rounded-full border-4 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
            <i className="ri-focus-3-line text-5xl text-primary animate-pulse-slow" />
          </div>
        </div>
        
        <div className="space-y-8 w-full max-w-xs">
          <Button 
            onClick={onStartGame}
            className="w-full px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            size="lg"
          >
            <i className="ri-star-line text-2xl mr-2" />
            Play Now
          </Button>
          
          {showLeaderboard && (
            <Button 
              onClick={showLeaderboard}
              variant="outline"
              className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5 shadow-lg shadow-primary/20"
            >
              <i className="ri-trophy-line text-2xl mr-2 text-primary" />
              Leaderboard
            </Button>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default HomeScreen;

