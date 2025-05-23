import React from 'react';
import { calculateAccuracy } from '@/utils/circleUtils';
import AdBanner from './AdBanner';
import BottomNav from './BottomNav';
import { useDrawingState } from '@/hooks/useDrawingState';
import CanvasRenderer from './drawing/CanvasRenderer';
import QualityIndicator from './drawing/QualityIndicator';
import InstructionOverlay from './drawing/InstructionOverlay';

interface DrawingCanvasProps {
  onComplete: (accuracy: number, points: Array<{ x: number; y: number }>) => void;
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onComplete, targetCircle }) => {
  const {
    isDrawing,
    points,
    drawingPoints,
    strokeQuality,
    instructionVisible,
    showGhostCircle,
    handleStart,
    handleMove,
    handleEnd,
  } = useDrawingState();

  const finalizeDrawing = () => {
    if (!isDrawing || points.length < 2) return;
    
    const accuracy = calculateAccuracy(points, targetCircle);
    
    // Add haptic feedback if available (subtle for good strokes, stronger for poor ones)
    if ('navigator' in window && 'vibrate' in navigator) {
      if (accuracy > 80) {
        // Gentle pulse for good result
        navigator.vibrate([20]);
      } else if (accuracy > 50) {
        // Medium feedback
        navigator.vibrate([40, 30, 40]);
      } else {
        // Strong feedback for poor result
        navigator.vibrate([60, 30, 60, 30, 60]);
      }
    }
    
    setTimeout(() => {
      onComplete(accuracy, points);
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
    finalizeDrawing();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
    finalizeDrawing();
  };

  return (
    <div className="absolute inset-0 pb-16">
      <InstructionOverlay 
        visible={instructionVisible} 
        message="Draw the circle"
        position="top"
        variant="primary"
        animateIn={true}
      />
      
      <QualityIndicator 
        isDrawing={isDrawing} 
        pointsLength={points.length} 
        strokeQuality={strokeQuality}
        position="bottom-right"
        size="md"
        showPulse={true}
        thresholds={{ high: 0.7, medium: 0.4 }}
      />
      
      <div 
        className="w-full h-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <CanvasRenderer 
          drawingPoints={drawingPoints}
          targetCircle={targetCircle}
          showGhostCircle={showGhostCircle}
          strokeQuality={strokeQuality}
        />
      </div>

      <div className="fixed bottom-0 w-full">
        <AdBanner />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default DrawingCanvas;
