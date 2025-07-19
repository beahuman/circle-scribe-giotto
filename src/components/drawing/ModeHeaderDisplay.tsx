import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  CircleDot, 
  Calendar, 
  EyeOff, 
  Target, 
  Infinity, 
  Shuffle,
  Zap,
  Shapes
} from 'lucide-react';

interface ModeHeaderDisplayProps {
  mode: string;
  size?: 'sm' | 'md' | 'lg';
}

const ModeHeaderDisplay: React.FC<ModeHeaderDisplayProps> = ({
  mode,
  size = 'md'
}) => {
  const getModeConfig = (modeId: string) => {
    const configs = {
      'practice': {
        name: 'Free Practice',
        icon: CircleDot,
        color: 'bg-primary/10 text-primary border-primary/20',
        description: 'Perfect your technique'
      },
      'daily': {
        name: 'Daily Calibration',
        icon: Calendar,
        color: 'bg-score-good/10 text-score-good border-score-good/20',
        description: 'Neural consistency training'
      },
      'blind-draw': {
        name: 'Blind Draw',
        icon: EyeOff,
        color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        description: 'Memory-based drawing'
      },
      'offset': {
        name: 'Offset Challenge',
        icon: Target,
        color: 'bg-warning/10 text-warning border-warning/20',
        description: 'Adaptive positioning'
      },
      'perception-gauntlet': {
        name: 'Perception Gauntlet',
        icon: Shuffle,
        color: 'bg-error/10 text-error border-error/20',
        description: 'Speed & accuracy test'
      },
      'infinite-practice': {
        name: 'Infinite Mode',
        icon: Infinity,
        color: 'bg-success/10 text-success border-success/20',
        description: 'Endless flow state'
      },
      'penalty': {
        name: 'Penalty Mode',
        icon: Zap,
        color: 'bg-destructive/10 text-destructive border-destructive/20',
        description: 'High stakes practice'
      },
      'shapes': {
        name: 'Shape Challenge',
        icon: Shapes,
        color: 'bg-secondary/10 text-secondary border-secondary/20',
        description: 'Geometric mastery'
      }
    };
    
    return configs[modeId] || configs['practice'];
  };
  
  const config = getModeConfig(mode);
  const IconComponent = config.icon;
  
  const sizeClasses = {
    'sm': 'text-description px-3 py-2',
    'md': 'text-body px-4 py-3',
    'lg': 'text-subheader px-6 py-4'
  };
  
  const iconSizes = {
    'sm': 'h-4 w-4',
    'md': 'h-5 w-5',
    'lg': 'h-6 w-6'
  };

  return (
    <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-30">
      <Badge 
        variant="outline" 
        className={`${config.color} ${sizeClasses[size]} flex items-center gap-2 
                   backdrop-blur-sm shadow-elegant transition-smooth hover:scale-105 whitespace-nowrap`}
      >
        <IconComponent className={iconSizes[size]} strokeWidth={2} />
        <span className="font-medium">{config.name}</span>
      </Badge>
      
      {size !== 'sm' && (
        <p className="text-caption text-center mt-2 text-muted-foreground">
          {config.description}
        </p>
      )}
    </div>
  );
};

export default ModeHeaderDisplay;