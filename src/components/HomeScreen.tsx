import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft, Ghost, Pencil, Share2, BadgeDollarSign } from "lucide-react";
import LogoAnimation from './LogoAnimation';
import { Dialog } from '@capacitor/dialog';

interface HomeScreenProps { 
  onStart: () => void; 
  showLeaderboard?: () => void; 
  onBackToHome?: () => void;
  isGuestMode?: boolean;
  onRemoveAds?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onStart, 
  showLeaderboard, 
  onBackToHome,
  isGuestMode,
  onRemoveAds
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
        
        // Use capacitor dialog for native alert
        await Dialog.alert({
          title: 'Link copied',
          message: 'Link copied to clipboard!',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-6 animate-fade-in p-6 pb-24 text-center">
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

      <div className="space-y-2 text-center">
        <div className="w-[240px] mx-auto">
          <LogoAnimation />
        </div>
        <p className="text-2xl font-bold text-[#765ED8] text-center">The art of the perfect circle</p>
      </div>
      
      <div className="max-w-md space-y-4 text-center">
        <p className="text-center">
          Draw a perfect circle with your finger, just like the Renaissance master Giotto.
        </p>
        <ol className="text-center space-y-2 text-sm text-muted-foreground mb-48">
          <li>1. You'll be shown a perfect circle for 3 seconds</li>
          <li>2. Then try to recreate it in the same location</li>
          <li>3. Your accuracy will be calculated as a percentage</li>
        </ol>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
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
          variant="secondary"
          className="px-8 py-6 text-lg rounded-full bg-white border-[#765ED8] border text-[#765ED8] hover:bg-[#765ED8]/5"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Giotto
        </Button>

        {onRemoveAds && (
          <Button
            onClick={onRemoveAds}
            variant="ghost"
            className="text-yellow-500 hover:text-yellow-600 hover:bg-transparent"
          >
            <BadgeDollarSign className="h-5 w-5" />
            Remove Ads
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
