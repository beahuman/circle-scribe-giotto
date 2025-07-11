import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StoreHeaderProps {
  level: number;
  xp: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  onRestorePurchases: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  level,
  xp,
  xpInCurrentLevel,
  xpForNextLevel,
  onRestorePurchases
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="flex gap-2 items-center"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRestorePurchases}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Restore
          </Button>
          
          <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm">
              {level}
            </span>
            <span className="font-medium">{xp} XP</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Visual Atelier
        </h1>
        <p className="text-muted-foreground">
          Earn through play or purchase to personalize your experience
        </p>
        
        <div className="max-w-xs mx-auto mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <Progress value={(xpInCurrentLevel / xpForNextLevel) * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{xpInCurrentLevel} XP</span>
            <span>{xpForNextLevel} XP</span>
          </div>
        </div>
      </div>
    </>
  );
};