import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, ArrowLeft, Ghost, Pencil } from "lucide-react";
import LogoAnimation from './LogoAnimation';

interface WelcomeScreenProps {
  onStart: () => void;
  showLeaderboard?: () => void;
  onBackToHome?: () => void;
  isGuestMode?: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onStart, 
  showLeaderboard, 
  onBackToHome,
  isGuestMode 
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center">
      {onBackToHome && (
        <Button 
          variant="ghost" 
          onClick={onBackToHome}
          className="absolute top-4 left-4"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      )}

      <div className="space-y-2">
        <div className="w-full max-w-xs mx-auto">
          <LogoAnimation />
        </div>
        <p className="text-lg font-bold text-[#765ED8]">The art of the perfect circle</p>
      </div>
      
      {isGuestMode && (
        <Alert>
          <AlertDescription className="flex items-center gap-2">
            <Ghost className="h-4 w-4" />
            Playing as guest - scores won't be saved
          </AlertDescription>
        </Alert>
      )}
      
      <div className="max-w-md space-y-4">
        <p>
          Draw a perfect circle with your finger, just like the Renaissance master Giotto.
        </p>
        <ol className="text-left space-y-2 text-sm text-muted-foreground">
          <li>1. You'll be shown a perfect circle for 3 seconds</li>
          <li>2. Then try to recreate it in the same location</li>
          <li>3. Your accuracy will be calculated as a percentage</li>
        </ol>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button 
          onClick={onStart}
          className="px-8 py-6 text-lg rounded-full animate-pulse-slow"
        >
          <Pencil className="mr-2" size={20} />
          Draw Now
        </Button>
        
        {showLeaderboard && !isGuestMode && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-8 py-6 text-lg rounded-full text-primary"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
