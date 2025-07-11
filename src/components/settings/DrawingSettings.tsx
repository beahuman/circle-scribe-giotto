
import React from 'react';
import { Slider } from "@/components/ui/slider";
import LogoAnimation from '../LogoAnimation';

interface DrawingSettingsProps {
  drawingPrecision: number;
  onPrecisionChange: (value: number[]) => void;
}

const DrawingSettings = ({ drawingPrecision, onPrecisionChange }: DrawingSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-medium">
        <LogoAnimation size={20} />
        Drawing Precision
      </div>
      <p className="text-sm text-muted-foreground -mt-2">Adjust the smoothness of circle drawing</p>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Precision Level</span>
          <span className="font-medium">{drawingPrecision}%</span>
        </div>
        <Slider
          value={[drawingPrecision]}
          min={10}
          max={100}
          step={5}
          onValueChange={onPrecisionChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>More Detail</span>
          <span>Smoother</span>
        </div>
      </div>
    </div>
  );
};

export default DrawingSettings;
