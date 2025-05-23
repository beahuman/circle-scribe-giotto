
import React, { useRef, useState, useEffect } from 'react';
import { calculateAccuracy, smoothPoints } from '@/utils/circleUtils';
import AdBanner from './AdBanner';
import BottomNav from './BottomNav';

interface Point {
  x: number;
  y: number;
}

interface DrawingCanvasProps {
  onComplete: (accuracy: number, points: Array<{ x: number; y: number }>) => void;
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onComplete, targetCircle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [instructionVisible, setInstructionVisible] = useState(true);
  const [drawingPoints, setDrawingPoints] = useState<Point[]>([]);
  const [strokeQuality, setStrokeQuality] = useState(1); // 0 = poor, 1 = excellent
  const [strokeSpeed, setStrokeSpeed] = useState(0); // Speed of drawing
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);

  // Calculate stroke quality metrics
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

  // Separate rendering from data collection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70; // Adjust for bottom nav
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (points.length > 1) {
      // Create a smooth visual representation
      const drawingPrecision = Number(localStorage.getItem('drawingPrecision')) || 50;
      const smoothedPoints = smoothPoints(points, Math.max(30, drawingPrecision));
      setDrawingPoints(smoothedPoints);
    }
  }, [points]);
  
  // Separate effect for actual drawing to improve performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (drawingPoints.length > 1) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(drawingPoints[0].x, drawingPoints[0].y);
      
      // Apply neuroscience-inspired visual feedback based on stroke quality
      const baseLineWidth = 4;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4); // Thicker for better strokes
      
      // Higher quality strokes get better visual treatment
      ctx.strokeStyle = `hsl(var(--primary) / ${0.7 + strokeQuality * 0.3})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Add subtle glow for high quality strokes
      if (strokeQuality > 0.7) {
        ctx.shadowColor = 'hsl(var(--primary) / 0.6)';
        ctx.shadowBlur = 4 * strokeQuality;
      } else {
        ctx.shadowBlur = 0;
      }
      
      for (let i = 1; i < drawingPoints.length; i++) {
        ctx.lineTo(drawingPoints[i].x, drawingPoints[i].y);
      }
      
      ctx.stroke();
    }
  }, [drawingPoints, strokeQuality]);

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

  return (
    <div className="absolute inset-0 pb-16">
      {instructionVisible && (
        <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-[#765ED8] px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in">
          <span className="text-lg font-medium text-white block text-center">Draw the circle</span>
        </div>
      )}
      
      {/* Subtle quality indicator */}
      {isDrawing && points.length > 10 && (
        <div 
          className="fixed bottom-24 right-6 w-3 h-3 rounded-full transition-colors duration-300"
          style={{ 
            backgroundColor: strokeQuality > 0.7 
              ? 'hsl(var(--primary))' 
              : strokeQuality > 0.4 
                ? 'hsl(var(--primary) / 0.5)' 
                : 'hsl(var(--destructive) / 0.7)',
            boxShadow: strokeQuality > 0.7 
              ? '0 0 8px hsl(var(--primary))' 
              : 'none',
            opacity: isDrawing ? 0.8 : 0
          }}
        />
      )}
      
      <canvas
        ref={canvasRef}
        className="touch-none"
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handleStart(touch.clientX, touch.clientY);
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handleMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={handleEnd}
      />

      <div className="fixed bottom-0 w-full">
        <AdBanner />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default DrawingCanvas;
