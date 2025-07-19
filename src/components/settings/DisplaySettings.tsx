
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Timer } from 'lucide-react';

interface DisplaySettingsProps {
  displayDuration: number;
  onDurationChange: (value: number[]) => void;
}

const DisplaySettings = ({ displayDuration, onDurationChange }: DisplaySettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <Timer size={18} className="text-primary" />
        Display Duration
      </div>
      <p className="text-sm text-muted-foreground -mt-2">Seconds to display the target circle</p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Duration (seconds)</span>
          <span className="font-medium">{displayDuration}s</span>
        </div>
        <Slider
          value={[displayDuration]}
          min={1}
          max={10}
          step={1}
          onValueChange={onDurationChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Shorter</span>
          <span>Longer</span>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
