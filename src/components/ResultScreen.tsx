
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, Star, Share2, BadgeDollarSign } from "lucide-react";
import BottomNav from './BottomNav';
import AdBanner from './AdBanner';

interface ResultScreenProps {
  accuracy: number;
  difficultyLevel: number;
  onReplay: () => void;
  showLeaderboard?: () => void;
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  onBackToHome?: () => void;
  onRemoveAds?: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  accuracy,
  difficultyLevel,
  onReplay,
  showLeaderboard,
  targetCircle,
  drawnPoints,
  onBackToHome,
  onRemoveAds
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  
  // Enhanced snarky feedback messages based on accuracy score
  const getFeedbackMessage = (score: number) => {
    if (score >= 95) return "Wow, did you use a compass? That's cheating! Or maybe you're secretly Giotto himself?";
    if (score >= 90) return "Almost suspiciously perfect. Did you trace it with your nose pressed against the screen?";
    if (score >= 85) return "Not bad! Giotto is still laughing, but not as hard as before.";
    if (score >= 80) return "Your art teacher called. She wants her 'participation trophy' back.";
    if (score >= 75) return "My toddler cousin drew a better circle with their eyes closed. During an earthquake.";
    if (score >= 70) return "I've seen rounder squares. Seriously, what was that supposed to be?";
    if (score >= 65) return "My grandmother can draw better circles in her sleep. And she doesn't have hands.";
    if (score >= 60) return "Was your finger having a seizure while drawing that?";
    if (score >= 50) return "Did you draw that with your eyes closed? Or maybe your elbow?";
    if (score >= 40) return "I'd call that a circle... if I were legally blind and extremely generous.";
    if (score >= 30) return "Are you sure that was supposed to be a circle? Looks more like a cat sat on your phone.";
    if (score >= 20) return "Did you mistake 'circle' for 'abstract modern art'? Because... wow.";
    return "That's more of a potato than a circle! Did you even try?";
  };
  
  const containerSize = 200;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  
  const scaleFactor = (containerSize * 0.8) / (targetCircle.radius * 2);
  
  let sumX = 0, sumY = 0;
  drawnPoints.forEach(point => {
    sumX += point.x;
    sumY += point.y;
  });
  const drawnCenterX = drawnPoints.length ? sumX / drawnPoints.length : 0;
  const drawnCenterY = drawnPoints.length ? sumY / drawnPoints.length : 0;
  
  const transformedDrawnPoints = drawnPoints.map(point => ({
    x: centerX + (point.x - drawnCenterX) * scaleFactor,
    y: centerY + (point.y - drawnCenterY) * scaleFactor
  }));
  
  const handleShare = async () => {
    const shareText = `I drew a circle with ${roundedAccuracy}% accuracy in Giotto! Can you beat my score?`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Giotto Score',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        alert('Score and link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in p-6 pt-12 text-center">
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      <div className="relative w-[200px] h-[200px] mx-auto my-6 rounded-full shadow-lg bg-gradient-to-br from-background to-muted/20">
        <div 
          className="absolute border-2 border-primary/50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" 
          style={{
            width: containerSize * 0.8,
            height: containerSize * 0.8,
            borderRadius: '50%',
          }} 
        />
        
        {drawnPoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <path
              d={transformedDrawnPoints.length > 0 ? 
                `M ${transformedDrawnPoints[0].x} ${transformedDrawnPoints[0].y} 
                 ${transformedDrawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` : ''}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ 
                filter: "drop-shadow(0 0 2px hsla(var(--primary), 0.5))",
                strokeDasharray: "1, 0"
              }}
            />
          </svg>
        )}
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          {isGoodScore ? (
            <i className="ri-checkbox-circle-line text-5xl text-primary animate-pulse-slow" />
          ) : (
            <i className="ri-close-circle-line text-5xl text-muted-foreground" />
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {roundedAccuracy}%
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm">
            <Star className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground">
              Difficulty Level: {difficultyLevel}%
            </span>
            <Star className="h-4 w-4 text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-muted-foreground max-w-xs">
          {getFeedbackMessage(roundedAccuracy)}
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs mb-20">
        <Button 
          onClick={onReplay}
          className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          Try Again
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="secondary"
            className="px-8 py-6 text-lg rounded-full border border-[#765ED8] text-[#765ED8] bg-white hover:bg-[#765ED8]/10"
          >
            <Trophy className="mr-2 h-5 w-5" />
            View Leaderboard
          </Button>
        )}

        <Button 
          onClick={handleShare}
          variant="secondary"
          className="px-8 py-6 text-lg rounded-full bg-white border-[#765ED8] border text-[#765ED8] hover:bg-[#765ED8]/5"
        >
          <Share2 className="mr-2 h-5 w-5" />
          Share Score
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

      <AdBanner />

      <BottomNav />
    </div>
  );
};

export default ResultScreen;
