
import React from 'react';
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Trophy, ArrowLeft, Home } from "lucide-react";

interface ResultScreenProps {
  accuracy: number;
  onReplay: () => void;
  showLeaderboard?: () => void;
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  onBackToHome?: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  accuracy, 
  onReplay, 
  showLeaderboard,
  targetCircle,
  drawnPoints,
  onBackToHome
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  
  // Use fixed dimensions for visualization container
  const containerSize = 200;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  
  // Calculate scaling factor to fit the circle in our container
  const scaleFactor = (containerSize * 0.8) / (targetCircle.radius * 2);
  
  // Calculate average position of drawn points (to center them)
  let sumX = 0, sumY = 0;
  drawnPoints.forEach(point => {
    sumX += point.x;
    sumY += point.y;
  });
  const drawnCenterX = drawnPoints.length ? sumX / drawnPoints.length : 0;
  const drawnCenterY = drawnPoints.length ? sumY / drawnPoints.length : 0;
  
  // Transform drawn points to be centered over target circle
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
          <Home className="h-5 w-5" />
        </Button>
      )}
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      {/* Visualization container - positioned between text and score */}
      <div className="relative w-[200px] h-[200px] mx-auto my-6">
        {/* Target Circle - positioned absolutely in the center */}
        <div 
          className="absolute border-2 border-primary/30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
          style={{
            width: containerSize * 0.8,
            height: containerSize * 0.8,
            borderRadius: '50%',
          }} 
        />
        
        {/* Drawn Circle - positioned on top */}
        {drawnPoints.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <path
              d={transformedDrawnPoints.length > 0 ? 
                `M ${transformedDrawnPoints[0].x} ${transformedDrawnPoints[0].y} 
                 ${transformedDrawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` : ''}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
          </svg>
        )}
        
        {/* Checkmark or X - positioned on top of both circles */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          {isGoodScore ? (
            <CircleCheck className="text-primary animate-pulse-slow" size={60} />
          ) : (
            <CircleX className="text-muted-foreground" size={60} />
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-5xl font-bold">
          {roundedAccuracy}%
        </div>
        <p className="text-muted-foreground">
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
          className="px-8 py-6 text-lg rounded-full"
        >
          Try Again (Please!)
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-8 py-6 text-lg rounded-full"
          >
            <Trophy className="mr-2 h-5 w-5" />
            View Better Artists
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultScreen;
