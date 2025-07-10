import React, { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateAccuracy } from '@/utils/circleUtils';
import { useDrawingState } from '@/hooks/useDrawingState';
import QualityIndicator from './drawing/QualityIndicator';
import InstructionOverlay from './drawing/InstructionOverlay';
import { Point } from '@/types/shapes';
import { useSettings } from '@/hooks/useSettings';

interface BlindDrawCanvasProps {
  onComplete: (accuracy: number, points: Point[]) => void;
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
}

const BlindDrawCanvas: React.FC<BlindDrawCanvasProps> = ({ 
  onComplete, 
  targetCircle 
}) => {
  const { settings } = useSettings();
  const [showGhostReveal, setShowGhostReveal] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);
  const [drawnPath, setDrawnPath] = useState<Point[]>([]);
  
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

  // Helper function to create SVG path
  const createPath = (points: Point[]) => {
    if (points.length === 0) return '';
    const pathCommands: string[] = [];
    pathCommands.push(`M ${points[0].x} ${points[0].y}`);
    
    for (let i = 1; i < points.length; i++) {
      pathCommands.push(`L ${points[i].x} ${points[i].y}`);
    }
    
    return pathCommands.join(' ');
  };

  const finalizeDrawing = useCallback(() => {
    if (!isDrawing || points.length < 2) return;
    
    setDrawnPath([...points]);
    
    // Start the ghost reveal animation
    setShowGhostReveal(true);
    
    // Animate the reveal progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02;
      setRevealProgress(progress);
      
      if (progress >= 1) {
        clearInterval(interval);
        // Calculate accuracy and complete after reveal
        setTimeout(() => {
          const accuracy = calculateAccuracy(points, targetCircle);
          
          // Haptic feedback
          if ('navigator' in window && 'vibrate' in navigator) {
            const pattern = accuracy > 80 ? [20] : accuracy > 50 ? [40, 30, 40] : [60, 30, 60, 30, 60];
            navigator.vibrate(pattern);
          }
          
          onComplete(accuracy, points);
        }, 500);
      }
    }, 16); // ~60fps
    
  }, [isDrawing, points, targetCircle, onComplete]);

  // Touch handlers
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

  // Mouse handlers
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

  const getBlindModeMessage = () => {
    const tone = settings.feedbackTone || 'playful';
    switch (tone) {
      case 'playful':
        return "Draw with your mind, not your eyes";
      case 'calm':
        return "Trust your inner compass";
      case 'formal':
        return "Proprioceptive challenge mode";
      case 'sarcastic':
        return "Good luck with that";
      default:
        return "Draw blind - feel the perfect circle";
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-900" style={{ paddingBottom: '64px' }}>
      <InstructionOverlay 
        visible={instructionVisible && !showGhostReveal} 
        message={getBlindModeMessage()}
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

      {/* Ghost Trail Reveal Animation */}
      {showGhostReveal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            style={{ zIndex: 10 }}
          >
            {/* Animated reveal of drawn path */}
            {drawnPath.length > 0 && (
              <path
                d={createPath(drawnPath)}
                stroke="rgba(168, 85, 247, 0.8)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${drawnPath.length * 2}`}
                strokeDashoffset={`${drawnPath.length * 2 * (1 - revealProgress)}`}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))',
                  transition: 'stroke-dashoffset 0.016s ease-out'
                }}
              />
            )}
            
            {/* Pulse effect at current reveal position */}
            {revealProgress < 1 && drawnPath.length > 0 && (
              <circle
                cx={drawnPath[Math.floor(revealProgress * (drawnPath.length - 1))]?.x || 0}
                cy={drawnPath[Math.floor(revealProgress * (drawnPath.length - 1))]?.y || 0}
                r="6"
                fill="rgba(168, 85, 247, 0.4)"
                className="animate-pulse"
              />
            )}
          </svg>
        </motion.div>
      )}
      
      <div 
        className="w-full h-full select-none relative"
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
        {/* Dark background canvas */}
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}
        >
          {/* Target circle outline (always visible) */}
          <circle
            cx={targetCircle.x}
            cy={targetCircle.y}
            r={targetCircle.radius}
            stroke="rgba(148, 163, 184, 0.3)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
          />
          
          {/* Starting point indicator */}
          {!isDrawing && !showGhostReveal && (
            <circle
              cx={targetCircle.x}
              cy={targetCircle.y - targetCircle.radius}
              r="4"
              fill="rgba(34, 197, 94, 0.8)"
              className="animate-pulse"
            />
          )}
          
          {/* Current drawing stroke - INVISIBLE during drawing */}
          {isDrawing && drawingPoints.length > 1 && !showGhostReveal && (
            <path
              d={createPath(drawingPoints)}
              stroke="transparent"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default BlindDrawCanvas;