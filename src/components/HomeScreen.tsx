import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CircleDot, Trophy, History, HelpCircle, Info, Settings, Stars, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import BottomNav from './BottomNav';
import { useToast } from '@/hooks/use-toast';

interface HomeScreenProps {
  onStartGame: () => void;
  showLeaderboard?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, showLeaderboard }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock authentication state - would come from auth context in real app
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('GiottoMaster');
  
  const handleSignOut = () => {
    setIsLoggedIn(false);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };
  
  // For demo purposes, this lets us toggle the logged in state
  const toggleLoginState = () => {
    setIsLoggedIn(!isLoggedIn);
    if (!isLoggedIn) {
      toast({
        title: "Demo Mode",
        description: "Signed in as GiottoMaster",
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="opacity-0 pointer-events-none"
        >
          <Settings className="h-5 w-5" />
        </Button>
        
        <div 
          className="rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 px-4 py-1.5 font-bold text-primary flex items-center gap-2 animate-pulse-slow cursor-pointer"
          onClick={toggleLoginState}
        >
          <Stars className="h-4 w-4" />
          <span>Giotto</span>
          <Stars className="h-4 w-4" />
        </div>
        
        <div className="w-10" /> {/* Spacer to replace avatar */}
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6 text-center pb-24">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border-4 border-primary/20 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-dashed border-2 border-primary/40"></div>
          <div className="w-44 h-44 rounded-full border-4 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center">
            <CircleDot className="text-primary animate-pulse-slow" size={64} />
          </div>
        </div>
        
        <div className="space-y-2 max-w-xs">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Giotto's Circle
          </h1>
          <p className="text-lg text-muted-foreground">Can you draw the perfect circle?</p>
        </div>
        
        <div className="space-y-8 w-full max-w-xs"> {/* Increased gap between buttons */}
          <Button 
            onClick={onStartGame}
            className="w-full px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            size="lg"
          >
            <Star className="mr-2 h-6 w-6 animate-pulse" /> {/* More playful icon */}
            Play Now
          </Button>
          
          {showLeaderboard && (
            <Button 
              onClick={showLeaderboard}
              variant="outline"
              className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5"
            >
              <Trophy className="mr-2 h-6 w-6 text-primary animate-bounce" /> {/* More playful animation */}
              Leaderboard
            </Button>
          )}
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default HomeScreen;
