
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, ArrowLeft, Ghost, Pencil, Share2 } from "lucide-react";
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
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Giotto - The Art of the Perfect Circle',
          text: 'Challenge yourself to draw the perfect circle! Try Giotto, a fun game inspired by Renaissance master Giotto.',
          url: window.location.href
        });
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

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

        <Button
          onClick={handleShare}
          variant="ghost"
          className="px-8 py-4 text-lg rounded-full text-primary hover:bg-primary/10"
        >
          <Share2 className="mr-2 h-5 w-5 text-primary" />
          Share Giotto
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
