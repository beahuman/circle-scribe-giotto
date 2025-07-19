
import React from 'react';
import { cn } from '@/lib/utils';

interface QualityIndicatorProps {
  isDrawing: boolean;
  pointsLength: number;
  strokeQuality: number;
  minPointsToShow?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
  thresholds?: {
    high: number;
    medium: number;
  };
}

const QualityIndicator: React.FC<QualityIndicatorProps> = ({ 
  isDrawing, 
  pointsLength, 
  strokeQuality,
  minPointsToShow = 10,
  position = 'bottom-right',
  size = 'md',
  showPulse = true,
  className = '',
  thresholds = { high: 0.7, medium: 0.4 }
}) => {
  if (!isDrawing || pointsLength <= minPointsToShow) {
    return null;
  }

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'bottom-right': 'bottom-24 right-6',
    'bottom-left': 'bottom-24 left-6'
  };

  const sizeClasses = {
    'sm': 'w-2 h-2',
    'md': 'w-3 h-3',
    'lg': 'w-4 h-4'
  };

  const getQualityColor = () => {
    if (strokeQuality > thresholds.high) {
      return 'hsl(var(--primary))';
    } else if (strokeQuality > thresholds.medium) {
      return 'hsl(var(--primary) / 0.5)';
    }
    return 'hsl(var(--destructive) / 0.7)';
  };

  const getQualityShadow = () => {
    return strokeQuality > thresholds.high ? '0 0 8px hsl(var(--primary))' : 'none';
  };

  return (
    <div 
      className={cn(
        "fixed rounded-full transition-colors duration-300",
        positionClasses[position],
        sizeClasses[size],
        showPulse && strokeQuality > thresholds.high && "animate-pulse",
        className
      )}
      style={{ 
        backgroundColor: getQualityColor(),
        boxShadow: getQualityShadow(),
        opacity: isDrawing ? 0.8 : 0
      }}
      aria-hidden="true"
    />
  );
};

export default QualityIndicator;
