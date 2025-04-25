
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from 'lucide-react';

interface DifficultySettingsProps {
  difficultyLevel: number;
  onDifficultyChange: (value: number[]) => void;
}

const DifficultySettings = ({ difficultyLevel, onDifficultyChange }: DifficultySettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <SlidersHorizontal size={18} className="text-primary" />
        Game Difficulty
      </div>
      <p className="text-sm text-muted-foreground -mt-2">Adjust how challenging the game is</p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Difficulty Level</span>
          <span className="font-medium">{difficultyLevel}%</span>
        </div>
        <Slider
          value={[difficultyLevel]}
          min={10}
          max={100}
          step={5}
          onValueChange={onDifficultyChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Easy</span>
          <span>Hard</span>
        </div>
      </div>
    </div>
  );
};

export default DifficultySettings;
