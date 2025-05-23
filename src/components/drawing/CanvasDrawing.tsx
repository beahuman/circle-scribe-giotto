
import React, { useRef, useEffect } from 'react';
import { Point } from '@/types/shapes';
import { CanvasAnimator } from './CanvasAnimator';

interface CanvasDrawingProps {
  drawingPoints: Point[];
  targetCircle: { x: number; y: number; radius: number };
  strokeQuality: number;
  showGhostCircle: boolean;
  showCompletedDrawing: boolean;
  fadeOpacity: number;
}

const CanvasDrawing: React.FC<CanvasDrawingProps> = ({
  drawingPoints,
  targetCircle,
  strokeQuality,
  showGhostCircle,
  showCompletedDrawing,
  fadeOpacity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const trailPointsRef = useRef<Point[]>([]);
  const lastDrawnPointsRef = useRef<number>(0);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle canvas rendering with animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70; // Adjust for bottom nav
    
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // Reset trail if drawing is starting
    if (drawingPoints.length <= 1) {
      trailPointsRef.current = [];
      lastDrawnPointsRef.current = 0;
    }

    // Add new points to trail
    if (drawingPoints.length > lastDrawnPointsRef.current) {
      const newPoints = drawingPoints.slice(lastDrawnPointsRef.current);
      trailPointsRef.current = [...trailPointsRef.current, ...newPoints];
      lastDrawnPointsRef.current = drawingPoints.length;
    }

    // Start animation
    const cleanup = CanvasAnimator.startAnimation({
      canvas,
      trailPointsRef,
      targetCircle,
      strokeQuality,
      showGhostCircle,
      showCompletedDrawing,
      fadeOpacity
    });
    
    return cleanup || undefined;
  }, [drawingPoints, strokeQuality, showGhostCircle, targetCircle, showCompletedDrawing, fadeOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className="touch-none absolute top-0 left-0 w-full h-full"
    />
  );
};

export default CanvasDrawing;
