import React from 'react';
import { useBrushSystem } from '@/hooks/useBrushSystem';
import { useToneSystem } from '@/hooks/useToneSystem';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Paintbrush, Palette } from 'lucide-react';

interface ActiveBrushThemeDisplayProps {
  position?: 'top-left' | 'top-right';
  size?: 'sm' | 'md';
}

const ActiveBrushThemeDisplay: React.FC<ActiveBrushThemeDisplayProps> = ({
  position = 'top-right',
  size = 'sm'
}) => {
  const { getSelectedBrush } = useBrushSystem();
  const { selectedTone, getActiveThemeStyles } = useToneSystem();
  
  const selectedBrush = getSelectedBrush();
  const themeStyles = getActiveThemeStyles();
  
  const positionClasses = {
    'top-left': 'top-20 left-6',
    'top-right': 'top-20 right-6'
  };
  
  const sizeClasses = {
    'sm': 'p-3 gap-2',
    'md': 'p-4 gap-3'
  };

  return (
    <Card className={`fixed ${positionClasses[position]} ${sizeClasses[size]} z-30 backdrop-blur-sm bg-card/90 border-primary/20 
                      flex flex-col items-center shadow-elegant transition-smooth hover:bg-card/95 min-w-[100px]`}>
      {/* Brush Display */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-2 rounded-full bg-primary/10">
          <Paintbrush className="h-4 w-4 text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label font-medium truncate">{selectedBrush.name}</p>
          <div 
            className="w-4 h-2 radius-button border border-border/50"
            style={{ backgroundColor: selectedBrush.effectColor || '#765ED6' }}
          />
        </div>
      </div>
      
      {/* Theme Display */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-2 rounded-full bg-primary/10">
          <Palette className="h-4 w-4 text-primary" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-label font-medium truncate capitalize">{selectedTone}</p>
          <Badge 
            variant="outline" 
            className={`text-xs ${themeStyles.accent} border-primary/30 px-2 py-0`}
          >
            Theme
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default ActiveBrushThemeDisplay;