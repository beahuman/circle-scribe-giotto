
import React from 'react';

interface QualityIndicatorProps {
  isDrawing: boolean;
  pointsLength: number;
  strokeQuality: number;
}

const QualityIndicator: React.FC<QualityIndicatorProps> = ({ 
  isDrawing, 
  pointsLength, 
  strokeQuality 
}) => {
  if (!isDrawing || pointsLength <= 10) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-24 right-6 w-3 h-3 rounded-full transition-colors duration-300"
      style={{ 
        backgroundColor: strokeQuality > 0.7 
          ? 'hsl(var(--primary))' 
          : strokeQuality > 0.4 
            ? 'hsl(var(--primary) / 0.5)' 
            : 'hsl(var(--destructive) / 0.7)',
        boxShadow: strokeQuality > 0.7 
          ? '0 0 8px hsl(var(--primary))' 
          : 'none',
        opacity: isDrawing ? 0.8 : 0
      }}
    />
  );
};

export default QualityIndicator;
