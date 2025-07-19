
import React, { useState, useEffect } from 'react';
import { Point } from '@/types/shapes';
import ScoringOverlay from './ScoringOverlay';
import CanvasDrawing from './CanvasDrawing';
import { useBrushSystem } from '@/hooks/useBrushSystem';

interface CanvasRendererProps {
  drawingPoints: Point[];
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
  showGhostCircle: boolean;
  strokeQuality: number;
  showCompletedDrawing?: boolean;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ 
  drawingPoints, 
  targetCircle, 
  showGhostCircle, 
  strokeQuality,
  showCompletedDrawing = false
}) => {
  const { getSelectedBrush, checkForUnlocks } = useBrushSystem();
  const [fadeOpacity, setFadeOpacity] = useState(1);
  const [showSubmetrics, setShowSubmetrics] = useState(() => {
    return localStorage.getItem('showSubmetrics') === 'true';
  });
  
  const selectedBrush = getSelectedBrush();
  
  // Check for brush unlocks when component mounts or drawing completes
  useEffect(() => {
    if (showCompletedDrawing) {
      checkForUnlocks();
    }
  }, [showCompletedDrawing, checkForUnlocks]);
  
  // Handle fade-out effect for completed drawings
  useEffect(() => {
    if (showCompletedDrawing) {
      // Start fade-out after 1.5 seconds
      const fadeTimer = setTimeout(() => {
        let opacity = 1;
        const fadeInterval = setInterval(() => {
          opacity -= 0.02; // Gradual fade over ~1 second
          setFadeOpacity(Math.max(0, opacity));
          
          if (opacity <= 0) {
            clearInterval(fadeInterval);
          }
        }, 20);
        
        return () => clearInterval(fadeInterval);
      }, 1500);
      
      return () => clearTimeout(fadeTimer);
    } else {
      setFadeOpacity(1);
    }
  }, [showCompletedDrawing]);

  return (
    <div className="relative w-full h-full">
      <CanvasDrawing
        drawingPoints={drawingPoints}
        targetCircle={targetCircle}
        strokeQuality={strokeQuality}
        showGhostCircle={showGhostCircle}
        showCompletedDrawing={showCompletedDrawing}
        fadeOpacity={fadeOpacity}
        brushStyle={selectedBrush}
      />
      
      <ScoringOverlay
        drawingPoints={drawingPoints}
        targetCircle={targetCircle}
        showSubmetrics={showSubmetrics}
        visible={showCompletedDrawing}
        fadeOpacity={fadeOpacity}
        difficultyLevel={Number(localStorage.getItem('difficultyLevel')) || 50}
        isPenaltyMode={localStorage.getItem('penaltyModeEnabled') === 'true'}
      />
    </div>
  );
};

export default CanvasRenderer;
