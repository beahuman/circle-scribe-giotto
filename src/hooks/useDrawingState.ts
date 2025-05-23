
import { useState, useEffect } from 'react';
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
  const [strokeQuality, setStrokeQuality] = useState(1); // 0 = poor, 1 = excellent
  const [strokeSpeed, setStrokeSpeed] = useState(0); // Speed of drawing
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const [instructionVisible, setInstructionVisible] = useState(true);

  // Load ghost circle setting
  const [showGhostCircle] = useState(() => {
    return localStorage.getItem('showGhostCircle') === 'true';
  });
  
  // Process points into smoothed drawing points
  useEffect(() => {
    if (points.length > 1) {
      // Create a smooth visual representation
      const drawingPrecision = Number(localStorage.getItem('drawingPrecision')) || 50;
      const smoothedPoints = smoothPoints(points, Math.max(30, drawingPrecision));
      setDrawingPoints(smoothedPoints);
    }
  }, [points]);

  const updateStrokeMetrics = (newPoint: Point) => {
    if (!lastPoint || !lastTimestamp) return;
    
    const now = Date.now();
    const timeDelta = now - lastTimestamp;
    
    // Calculate speed (pixels per ms)
    const distance = Math.sqrt(
      Math.pow(newPoint.x - lastPoint.x, 2) + 
      Math.pow(newPoint.y - lastPoint.y, 2)
    );
    const newSpeed = distance / Math.max(1, timeDelta);
    
    // Update speed (weighted average)
    setStrokeSpeed(prev => prev * 0.7 + newSpeed * 0.3);
    
    // Calculate consistency in angle changes (smoother = higher quality)
    if (points.length >= 2) {
      const prevVector = {
        x: lastPoint.x - points[points.length - 2].x,
        y: lastPoint.y - points[points.length - 2].y
      };
      
      const newVector = {
        x: newPoint.x - lastPoint.x,
        y: newPoint.y - lastPoint.y
      };
      
      const prevMag = Math.sqrt(prevVector.x * prevVector.x + prevVector.y * prevVector.y);
      const newMag = Math.sqrt(newVector.x * newVector.x + newVector.y * newVector.y);
      
      if (prevMag > 0 && newMag > 0) {
        const dotProduct = (prevVector.x * newVector.x + prevVector.y * newVector.y) / (prevMag * newMag);
        const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
        
        // If angle change is too sharp or speed is inconsistent, reduce quality
        const consistencyFactor = Math.max(0, 1 - (angle / Math.PI));
        const speedConsistency = 1 - Math.min(1, Math.abs(newSpeed - strokeSpeed) / strokeSpeed);
        
        // Update quality (weighted average)
        setStrokeQuality(prev => {
          return Math.max(0, Math.min(1, prev * 0.9 + (consistencyFactor * speedConsistency) * 0.1));
        });
      }
    }
    
    setLastPoint(newPoint);
    setLastTimestamp(now);
  };

  const handleStart = (x: number, y: number) => {
    setIsDrawing(true);
    const newPoint = { x, y };
    setPoints([newPoint]);
    setDrawingPoints([newPoint]);
    setInstructionVisible(false);
    setLastPoint(newPoint);
    setLastTimestamp(Date.now());
    setStrokeQuality(1); // Reset quality at start of stroke
    setStrokeSpeed(0);
  };

  const handleMove = (x: number, y: number) => {
    if (!isDrawing) return;
    
    const newPoint = { x, y };
    
    // Update stroke metrics for neuroscience feedback
    updateStrokeMetrics(newPoint);
    
    // Direct path following for responsive feel
    setPoints(prevPoints => [...prevPoints, newPoint]);
  };

  const handleEnd = () => {
    if (!isDrawing || points.length < 2) return;
    setIsDrawing(false);
  };

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
