import React from 'react';
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Trophy, Home, Star } from "lucide-react";

interface ResultScreenProps {
  accuracy: number;
  difficultyLevel: number;
  onReplay: () => void;
  showLeaderboard?: () => void;
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  onBackToHome?: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  accuracy,
  difficultyLevel,
  onReplay,
  showLeaderboard,
  targetCircle,
  drawnPoints,
  onBackToHome
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  
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
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center">
      {onBackToHome && (
        <Button 
          variant="ghost" 
          onClick={onBackToHome}
          className="absolute top-4 left-4"
          size="icon"
        >
          <i className="ri-home-line text-xl text-primary" />
        </Button>
      )}
      
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
          {roundedAccuracy >= 95 ? "Wow, did you use a compass? That's cheating!" :
           roundedAccuracy >= 85 ? "Almost perfect! But Giotto is still laughing." :
           roundedAccuracy >= 75 ? "Not bad... for a kindergartener." :
           roundedAccuracy >= 65 ? "My grandmother can draw better circles in her sleep." :
           roundedAccuracy >= 50 ? "Did you draw that with your eyes closed?" :
           roundedAccuracy >= 35 ? "Are you sure that was supposed to be a circle?" :
           "That's more of a potato than a circle!"}
        </p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button 
          onClick={onReplay}
          className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          Try Again
        </Button>

        <Button 
          onClick={onBackToHome}
          variant="secondary"
          className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-muted/50 to-background border border-muted"
        >
          <i className="ri-home-line text-xl mr-2 text-primary" />
          Return to Home
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5"
          >
            <i className="ri-trophy-line text-xl mr-2 text-primary" />
            View Leaderboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
