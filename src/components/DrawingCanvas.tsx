
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawingPrecision = Number(localStorage.getItem('drawingPrecision')) || 50;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (points.length > 1) {
      const smoothedPoints = smoothPoints(points, drawingPrecision);
      
      ctx.beginPath();
      ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
      
      for (let i = 1; i < smoothedPoints.length; i++) {
        ctx.lineTo(smoothedPoints[i].x, smoothedPoints[i].y);
      }
      
      ctx.strokeStyle = 'hsl(var(--primary) / 0.8)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [points]);

  const handleStart = (x: number, y: number) => {
    setIsDrawing(true);
    setPoints([{ x, y }]);
    setInstructionVisible(false);
  };

  const handleMove = (x: number, y: number) => {
    if (!isDrawing) return;
    setPoints(prevPoints => [...prevPoints, { x, y }]);
  };

  const handleEnd = () => {
    if (!isDrawing || points.length < 2) return;
    
    setIsDrawing(false);
    
    const accuracy = calculateAccuracy(points, targetCircle);
    
    setTimeout(() => {
      onComplete(accuracy, points);
    }, 500);
  };

  return (
    <div className="absolute inset-0">
      {instructionVisible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-[#765ED8]/80 px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in">
          <span className="text-lg font-medium text-white block text-center">Draw the circle</span>
        </div>
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

      <div className="absolute bottom-0 w-full">
        <AdBanner />
        <BottomNav />
      </div>
    </div>
  );
};

export default DrawingCanvas;
