
import { useState, useEffect, useRef, useCallback } from 'react';
import { Point } from '@/types/shapes';
import { smoothPoints } from '@/utils/circleUtils';

export interface DrawingMetrics {
  strokeQuality: number;
  strokeSpeed: number;
}

export const useDrawingState = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [strokeQuality, setStrokeQuality] = useState(1);
  const [strokeSpeed, setStrokeSpeed] = useState(0);
  const [instructionVisible, setInstructionVisible] = useState(true);
  
  // Refs for real-time performance
  const lastPointRef = useRef<Point | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const frameRequestRef = useRef<number | null>(null);
  
  // Load ghost circle setting
  const [showGhostCircle] = useState(() => {
    return localStorage.getItem('showGhostCircle') === 'true';
  });
  
  // Optimized point processing with minimal delay
  const processPoints = useCallback((newPoints: Point[]) => {
    if (frameRequestRef.current) {
      cancelAnimationFrame(frameRequestRef.current);
    }
    
    frameRequestRef.current = requestAnimationFrame(() => {
      if (newPoints.length > 1) {
        const drawingPrecision = Number(localStorage.getItem('drawingPrecision')) || 50;
        // Use minimal smoothing for real-time responsiveness
        const smoothedPoints = smoothPoints(newPoints, Math.max(20, drawingPrecision));
        setDrawingPoints(smoothedPoints);
      }
    });
  }, []);
  
  // Process points immediately for real-time visual feedback
  useEffect(() => {
    processPoints(points);
    
    return () => {
      if (frameRequestRef.current) {
        cancelAnimationFrame(frameRequestRef.current);
      }
    };
  }, [points, processPoints]);

  const updateStrokeMetrics = useCallback((newPoint: Point) => {
    const lastPoint = lastPointRef.current;
    const lastTimestamp = lastTimestampRef.current;
    
    if (!lastPoint || !lastTimestamp) return;
    
    const now = performance.now(); // Use high-precision timing
    const timeDelta = now - lastTimestamp;
    
    if (timeDelta < 1) return; // Skip if too frequent to avoid division issues
    
    const distance = Math.sqrt(
      Math.pow(newPoint.x - lastPoint.x, 2) + 
      Math.pow(newPoint.y - lastPoint.y, 2)
    );
    const newSpeed = distance / timeDelta;
    
    // Lightweight quality calculation
    setStrokeSpeed(prev => prev * 0.8 + newSpeed * 0.2);
    
    if (points.length >= 2) {
      const speedConsistency = Math.max(0.5, 1 - Math.min(1, Math.abs(newSpeed - strokeSpeed) / (strokeSpeed + 0.1)));
      setStrokeQuality(prev => Math.max(0.3, prev * 0.95 + speedConsistency * 0.05));
    }
    
    lastPointRef.current = newPoint;
    lastTimestampRef.current = now;
  }, [points.length, strokeSpeed]);

  const handleStart = useCallback((x: number, y: number) => {
    setIsDrawing(true);
    const newPoint = { x, y };
    setPoints([newPoint]);
    setDrawingPoints([newPoint]);
    setInstructionVisible(false);
    lastPointRef.current = newPoint;
    lastTimestampRef.current = performance.now();
    setStrokeQuality(1);
    setStrokeSpeed(0);
  }, []);

  const handleMove = useCallback((x: number, y: number) => {
    if (!isDrawing) return;
    
    const newPoint = { x, y };
    
    // Immediate point addition for real-time responsiveness
    setPoints(prevPoints => {
      const newPoints = [...prevPoints, newPoint];
      updateStrokeMetrics(newPoint);
      return newPoints;
    });
  }, [isDrawing, updateStrokeMetrics]);

  const handleEnd = useCallback(() => {
    if (!isDrawing || points.length < 2) return;
    
    // Immediate state change for instant feedback
    setIsDrawing(false);
  }, [isDrawing, points.length]);

  return {
    isDrawing,
    points,
    drawingPoints,
    strokeQuality,
    strokeSpeed,
    instructionVisible,
    showGhostCircle,
    handleStart,
    handleMove,
    handleEnd,
  };
};
