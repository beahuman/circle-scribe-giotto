import React, { useCallback, useState, useEffect } from 'react';
import { calculateAccuracy } from '@/utils/circleUtils';
import AdBanner from '../AdBanner';
import { useDrawingState } from '@/hooks/useDrawingState';
import CanvasRenderer from '../drawing/CanvasRenderer';
import QualityIndicator from '../drawing/QualityIndicator';
import InstructionOverlay from '../drawing/InstructionOverlay';
import { Point } from '@/types/shapes';

interface PerceptionGauntletCanvasProps {
  onComplete: (accuracy: number, points: Point[]) => void;
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
  difficultyLevel?: number;
}

const PerceptionGauntletCanvas: React.FC<PerceptionGauntletCanvasProps> = ({ 
  onComplete, 
  targetCircle,
  difficultyLevel = 50
}) => {
  const [showCirclePhase, setShowCirclePhase] = useState(true);
  const [drawingStarted, setDrawingStarted] = useState(false);
  
  const {
    isDrawing,
    points,
    drawingPoints,
    strokeQuality,
    instructionVisible,
    handleStart,
    handleMove,
    handleEnd,
  } = useDrawingState();

  // Hide circle after 3 seconds, then allow drawing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCirclePhase(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const finalizeDrawing = useCallback(() => {
    if (!isDrawing || points.length < 2) return;
    
    const accuracy = calculateAccuracy(points, targetCircle);
    
    // Haptic feedback for completion
    if ('navigator' in window && 'vibrate' in navigator) {
      const pattern = accuracy > 80 ? [20, 10, 20] : accuracy > 50 ? [40, 30, 40] : [60, 30, 60, 30, 60];
      navigator.vibrate(pattern);
    }
    
    onComplete(accuracy, points);
  }, [isDrawing, points, targetCircle, onComplete]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (showCirclePhase) return; // Prevent drawing during preview
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setDrawingStarted(true);
    handleStart(x, y);
  }, [handleStart, showCirclePhase]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (showCirclePhase) return;
    
    e.preventDefault();
    if (e.touches.length === 1 && drawingStarted) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      handleMove(x, y);
    }
  }, [handleMove, showCirclePhase, drawingStarted]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (showCirclePhase) return;
    
    e.preventDefault();
    handleEnd();
    finalizeDrawing();
  }, [handleEnd, finalizeDrawing, showCirclePhase]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (showCirclePhase) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDrawingStarted(true);
    handleStart(x, y);
  }, [handleStart, showCirclePhase]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (showCirclePhase) return;
    
    if (isDrawing && drawingStarted) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleMove(x, y);
    }
  }, [isDrawing, handleMove, showCirclePhase, drawingStarted]);

  const handleMouseUp = useCallback(() => {
    if (showCirclePhase) return;
    
    handleEnd();
    finalizeDrawing();
  }, [handleEnd, finalizeDrawing, showCirclePhase]);

  const getCurrentInstruction = () => {
    if (showCirclePhase) {
      return "Memorize this offset circle position";
    } else if (!drawingStarted) {
      return "Draw the circle from memory - no visual guide";
    }
    return "Drawing in progress...";
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800" style={{ paddingBottom: '64px' }}>
      <InstructionOverlay 
        visible={instructionVisible || showCirclePhase} 
        message={getCurrentInstruction()}
        position="top"
        variant="primary"
        animateIn={true}
      />
      
      {!showCirclePhase && (
        <QualityIndicator 
          isDrawing={isDrawing} 
          pointsLength={points.length} 
          strokeQuality={strokeQuality}
          position="bottom-right"
          size="md"
          showPulse={true}
          thresholds={{ high: 0.7, medium: 0.4 }}
        />
      )}
      
      {/* Phase indicator */}
      <div className="absolute top-4 left-4 space-y-2">
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          🧠 Perception Gauntlet
        </div>
        {showCirclePhase && (
          <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
            Preview Phase
          </div>
        )}
        {!showCirclePhase && drawingStarted && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
            Blind Draw Phase
          </div>
        )}
      </div>
      
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
          WebkitUserSelect: 'none',
          cursor: showCirclePhase ? 'not-allowed' : 'crosshair'
        }}
      >
        <CanvasRenderer 
          drawingPoints={drawingPoints}
          targetCircle={targetCircle}
          showGhostCircle={showCirclePhase} // Only show during preview
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

export default PerceptionGauntletCanvas;