
import React, { useCallback } from 'react';
import { calculateAccuracy } from '@/utils/circleUtils';
import AdBanner from './AdBanner';
import BottomNav from './BottomNav';
import { useDrawingState } from '@/hooks/useDrawingState';
import CanvasRenderer from './drawing/CanvasRenderer';
import QualityIndicator from './drawing/QualityIndicator';
import InstructionOverlay from './drawing/InstructionOverlay';
import { Point } from '@/types/shapes';

interface DrawingCanvasProps {
  onComplete: (accuracy: number, points: Point[]) => void;
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
  difficultyLevel?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onComplete, 
  targetCircle,
  difficultyLevel = 50
}) => {
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

  const finalizeDrawing = useCallback(() => {
    if (!isDrawing || points.length < 2) return;
    
    const accuracy = calculateAccuracy(points, targetCircle);
    
    // Immediate haptic feedback without delay
    if ('navigator' in window && 'vibrate' in navigator) {
      const pattern = accuracy > 80 ? [20] : accuracy > 50 ? [40, 30, 40] : [60, 30, 60, 30, 60];
      navigator.vibrate(pattern);
    }
    
    // Immediate callback - no artificial delay
    onComplete(accuracy, points);
  }, [isDrawing, points, targetCircle, onComplete]);

  // Optimized touch handlers with preventDefault for better performance
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Prevent browser scroll/zoom
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault(); // Critical for preventing browser interference
    if (e.touches.length === 1) { // Only handle single touch
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
    // Immediate finalization without setTimeout
    finalizeDrawing();
  }, [handleEnd, finalizeDrawing]);

  // Optimized mouse handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDrawing) {
      handleMove(e.clientX, e.clientY);
    }
  }, [isDrawing, handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
    // Immediate finalization without setTimeout
    finalizeDrawing();
  }, [handleEnd, finalizeDrawing]);

  return (
    <div className="absolute inset-0" style={{ paddingBottom: '64px' }}>
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
        className="w-full h-full select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ 
          touchAction: 'none', // Disable all touch behaviors
          userSelect: 'none',  // Prevent text selection
          WebkitTouchCallout: 'none', // Disable iOS callout
          WebkitUserSelect: 'none'    // Disable iOS text selection
        }}
      >
        <CanvasRenderer 
          drawingPoints={drawingPoints}
          targetCircle={targetCircle}
          showGhostCircle={showGhostCircle}
          strokeQuality={strokeQuality}
          showCompletedDrawing={!isDrawing && points.length > 1}
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
