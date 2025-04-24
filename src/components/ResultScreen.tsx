
import React from 'react';
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX, Trophy } from "lucide-react";

interface ResultScreenProps {
  accuracy: number;
  onReplay: () => void;
  showLeaderboard?: () => void;
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
}

const ResultScreen: React.FC<ResultScreenProps> = ({ 
  accuracy, 
  onReplay, 
  showLeaderboard,
  targetCircle,
  drawnPoints 
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Target Circle */}
        <div className="absolute border-2 border-primary/30" style={{
          width: targetCircle.radius * 2,
          height: targetCircle.radius * 2,
          borderRadius: '50%',
          left: targetCircle.x - targetCircle.radius,
          top: targetCircle.y - targetCircle.radius,
        }} />
        
        {/* Drawn Circle */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d={`M ${drawnPoints[0]?.x} ${drawnPoints[0]?.y} ${drawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
        
        {isGoodScore ? (
          <CircleCheck className="absolute text-primary animate-pulse-slow" size={60} />
        ) : (
          <CircleX className="absolute text-muted-foreground" size={60} />
        )}
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
