import React, { useCallback } from 'react';
import { calculateAccuracy } from '@/utils/circleUtils';
import { generateOffsetCirclePosition } from '@/utils/circleGeneration';
import AdBanner from '../AdBanner';
import { useDrawingState } from '@/hooks/useDrawingState';
import CanvasRenderer from '../drawing/CanvasRenderer';
import QualityIndicator from '../drawing/QualityIndicator';
import InstructionOverlay from '../drawing/InstructionOverlay';
import { Point } from '@/types/shapes';

interface OffsetCanvasProps {
  onComplete: (accuracy: number, points: Point[]) => void;
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
  difficultyLevel?: number;
  mirrorMode?: boolean;
}

const OffsetCanvas: React.FC<OffsetCanvasProps> = ({ 
  onComplete, 
  targetCircle,
  difficultyLevel = 50,
  mirrorMode = false
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
    
    // Haptic feedback
    if ('navigator' in window && 'vibrate' in navigator) {
      const pattern = accuracy > 80 ? [20] : accuracy > 50 ? [40, 30, 40] : [60, 30, 60, 30, 60];
      navigator.vibrate(pattern);
    }
    
    onComplete(accuracy, points);
  }, [isDrawing, points, targetCircle, onComplete]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    handleStart(x, y);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      handleMove(x, y);
    }
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
    finalizeDrawing();
  }, [handleEnd, finalizeDrawing]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleStart(x, y);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDrawing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleMove(x, y);
    }
  }, [isDrawing, handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
    finalizeDrawing();
  }, [handleEnd, finalizeDrawing]);

  return (
    <div className="absolute inset-0" style={{ paddingBottom: '64px' }}>
      <InstructionOverlay 
        visible={instructionVisible} 
        message={mirrorMode ? "Draw the mirrored circle" : "Draw the offset circle"}
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
      
      {mirrorMode && (
        <div className="absolute top-4 left-4 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          🪞 Mirror Mode
        </div>
      )}
      
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
          touchAction: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none'
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
    </div>
  );
};

export default OffsetCanvas;