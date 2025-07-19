
import React, { useRef, useEffect, useMemo } from 'react';
import { Point } from '@/types/shapes';
import { CanvasAnimator } from './CanvasAnimator';
import { BrushStyle } from '@/types/brushes';

interface CanvasDrawingProps {
  drawingPoints: Point[];
  targetCircle: { x: number; y: number; radius: number };
  strokeQuality: number;
  showGhostCircle: boolean;
  showCompletedDrawing: boolean;
  fadeOpacity: number;
  brushStyle?: BrushStyle;
}

const CanvasDrawing: React.FC<CanvasDrawingProps> = ({
  drawingPoints,
  targetCircle,
  strokeQuality,
  showGhostCircle,
  showCompletedDrawing,
  fadeOpacity,
  brushStyle
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const trailPointsRef = useRef<Point[]>([]);
  
  // Memoize canvas dimensions to match CircleDisplay
  const canvasDimensions = useMemo(() => ({
    width: window.innerWidth,
    height: window.innerHeight - 70 // Account for bottom nav (64px) + padding
  }), []);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Optimized canvas rendering with minimal re-renders
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas dimensions only when needed
    if (canvas.width !== canvasDimensions.width || canvas.height !== canvasDimensions.height) {
      canvas.width = canvasDimensions.width;
      canvas.height = canvasDimensions.height;
    }
    
    // Cancel any existing animation for performance
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // Update trail points efficiently
    trailPointsRef.current = drawingPoints;

    // Start optimized animation
    const cleanup = CanvasAnimator.startAnimation({
      canvas,
      trailPointsRef,
      targetCircle,
      strokeQuality,
      showGhostCircle,
      showCompletedDrawing,
      fadeOpacity,
      brushStyle
    });
    
    return cleanup || undefined;
  }, [drawingPoints, strokeQuality, showGhostCircle, targetCircle, showCompletedDrawing, fadeOpacity, canvasDimensions, brushStyle]);

  return (
    <canvas
      ref={canvasRef}
      className="touch-none absolute top-0 left-0"
      style={{ 
        width: canvasDimensions.width,
        height: canvasDimensions.height,
        touchAction: 'none', // Prevent browser touch handling for better performance
        willChange: 'transform' // Hint to browser for GPU acceleration
      }}
    />
  );
};

export default CanvasDrawing;
