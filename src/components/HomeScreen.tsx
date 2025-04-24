
import React from 'react';
import { Button } from "@/components/ui/button";
import { CircleDot, Trophy, History, HelpCircle, Info, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HomeScreenProps {
  onStartGame: () => void;
  showLeaderboard?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, showLeaderboard }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center min-h-screen">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold">Giotto</h1>
        <p className="text-lg text-muted-foreground">The art of the perfect circle</p>
      </div>
      
      <div className="relative">
        <div className="w-48 h-48 rounded-full border-4 border-primary opacity-50"></div>
        <CircleDot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" size={64} />
      </div>
      
      <div className="max-w-md space-y-4">
        <p className="text-lg">
          Can you draw a perfect freehand circle like the Renaissance master Giotto?
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button 
          onClick={onStartGame}
          className="px-8 py-6 text-lg rounded-full animate-pulse-slow"
          size="lg"
        >
          Play
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-8 py-4 rounded-full"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-xs">
        <Button 
          variant="secondary" 
          onClick={() => navigate('/history')}
          className="flex flex-col gap-1 h-20"
        >
          <History size={24} />
          <span>History</span>
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={() => navigate('/tutorial')}
          className="flex flex-col gap-1 h-20"
        >
          <HelpCircle size={24} />
          <span>Tutorial</span>
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={() => navigate('/about')}
          className="flex flex-col gap-1 h-20"
        >
          <Info size={24} />
          <span>About</span>
        </Button>
        
        <Button 
          variant="secondary" 
          onClick={() => navigate('/settings')}
          className="flex flex-col gap-1 h-20"
        >
          <Settings size={24} />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;
