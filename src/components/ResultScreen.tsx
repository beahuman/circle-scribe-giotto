
import React from 'react';
import { Button } from "@/components/ui/button";
import { CircleCheck, CircleX } from "lucide-react";

interface ResultScreenProps {
  accuracy: number;
  onReplay: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ accuracy, onReplay }) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  
  return (
    <div className="flex flex-col items-center justify-center gap-8 animate-fade-in p-6 text-center">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      <div className="relative flex items-center justify-center w-40 h-40">
        <div className={`rounded-full border-4 ${isGoodScore ? 'border-primary' : 'border-muted-foreground'}`} style={{
          width: '100%',
          height: '100%',
        }}></div>
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
          {roundedAccuracy >= 95 ? "Masterful! Giotto would be proud." :
           roundedAccuracy >= 85 ? "Impressive circle drawing skills!" :
           roundedAccuracy >= 75 ? "Good effort! Keep practicing." :
           roundedAccuracy >= 65 ? "Not bad, you're getting there." :
           "Room for improvement. Try again!"}
        </p>
      </div>
      
      <Button 
        onClick={onReplay}
        className="px-8 py-6 text-lg rounded-full"
      >
        Draw Again
      </Button>
    </div>
  );
};

export default ResultScreen;
