
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { StraightLine, Triangle, Square } from "lucide-react";
import { smoothPoints } from '@/utils/circleUtils';
import { evaluateShape } from '@/utils/shapeUtils';

type ShapeType = 'line' | 'triangle' | 'square';

interface ShapeChallengeProps {
  shapeType: ShapeType;
  onComplete: (accuracy: number) => void;
  difficultyLevel: number;
  completedShapes: number;
  totalShapesRequired: number;
}

const ShapeChallenge: React.FC<ShapeChallengeProps> = ({
  shapeType,
  onComplete,
  difficultyLevel,
  completedShapes,
  totalShapesRequired
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [instructionVisible, setInstructionVisible] = useState(true);
  const [targetShape, setTargetShape] = useState<{
    points: Array<{ x: number; y: number }>;
    width: number;
    height: number;
  }>({ points: [], width: 0, height: 0 });

  // Generate a target shape based on the type
  useEffect(() => {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight - 70;
    
    // Calculate center of screen
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Size based on screen dimensions (smaller of width/height)
    const size = Math.min(canvasWidth, canvasHeight) * 0.3;
    
    let shapePoints: Array<{ x: number; y: number }> = [];
    
    switch (shapeType) {
      case 'line':
        // Horizontal line
        shapePoints = [
          { x: centerX - size/2, y: centerY },
          { x: centerX + size/2, y: centerY }
        ];
        break;
      case 'triangle':
        // Equilateral triangle
        const height = size * 0.866; // height of equilateral triangle: h = a * √3/2
        shapePoints = [
          { x: centerX, y: centerY - height/2 },
          { x: centerX - size/2, y: centerY + height/2 },
          { x: centerX + size/2, y: centerY + height/2 },
          { x: centerX, y: centerY - height/2 } // Close the path
        ];
        break;
      case 'square':
        // Square
        shapePoints = [
          { x: centerX - size/2, y: centerY - size/2 },
          { x: centerX + size/2, y: centerY - size/2 },
          { x: centerX + size/2, y: centerY + size/2 },
          { x: centerX - size/2, y: centerY + size/2 },
          { x: centerX - size/2, y: centerY - size/2 } // Close the path
        ];
        break;
    }
    
    setTargetShape({
      points: shapePoints,
      width: size,
      height: size
    });
    
  }, [shapeType]);

  // Show target shape for 3 seconds
  const [showingTargetShape, setShowingTargetShape] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !targetShape) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70; // Adjust for bottom nav
    
    if (showingTargetShape && targetShape.points.length > 0) {
      // Draw the target shape
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(targetShape.points[0].x, targetShape.points[0].y);
      
      for (let i = 1; i < targetShape.points.length; i++) {
        ctx.lineTo(targetShape.points[i].x, targetShape.points[i].y);
      }
      
      ctx.strokeStyle = 'hsl(var(--primary) / 0.6)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Auto-hide target shape after 3 seconds
      const timer = setTimeout(() => {
        setShowingTargetShape(false);
        setInstructionVisible(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    if (!showingTargetShape && points.length > 0) {
      // Draw user's drawn shape
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
  }, [targetShape, showingTargetShape, points]);

  const handleStart = (x: number, y: number) => {
    if (showingTargetShape) return; // Can't start drawing while target shape is visible
    
    setIsDrawing(true);
    setPoints([{ x, y }]);
    setInstructionVisible(false);
  };

  const handleMove = (x: number, y: number) => {
    if (!isDrawing) return;
    setPoints(prevPoints => [...prevPoints, { x, y }]);
  };

  const handleEnd = () => {
    if (!isDrawing || showingTargetShape) return;
    setIsDrawing(false);
    
    if (points.length >= 2) {
      const drawingPrecision = Number(localStorage.getItem('drawingPrecision')) || 50;
      const smoothedPoints = smoothPoints(points, Math.max(30, drawingPrecision));
      
      // Calculate accuracy compared to the target shape
      const accuracy = evaluateShape(smoothedPoints, targetShape.points, shapeType);
      
      setTimeout(() => {
        onComplete(accuracy);
      }, 500);
    }
  };

  // Get shape icon based on type
  const getShapeIcon = () => {
    switch (shapeType) {
      case 'line': return <StraightLine className="h-6 w-6" />;
      case 'triangle': return <Triangle className="h-6 w-6" />;
      case 'square': return <Square className="h-6 w-6" />;
    }
  };

  // Get shape name for display
  const getShapeName = () => {
    return shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
  };

  return (
    <div className="absolute inset-0">
      {showingTargetShape && (
        <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-primary px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in z-10">
          <div className="flex items-center gap-2 text-white">
            <span>Memorize this {getShapeName()}</span>
            {getShapeIcon()}
          </div>
        </div>
      )}
      
      {!showingTargetShape && instructionVisible && (
        <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-primary px-6 py-2 rounded-full backdrop-blur-sm animate-fade-in z-10">
          <div className="flex items-center gap-2 text-white">
            <span>Now draw the {getShapeName()}</span>
            {getShapeIcon()}
          </div>
        </div>
      )}
      
      <div className="fixed top-16 inset-x-0 mx-auto w-fit px-6 py-2 rounded-full z-10">
        <div className="text-sm text-muted-foreground">
          Challenge {completedShapes + 1} of {totalShapesRequired}
        </div>
      </div>
      
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
    </div>
  );
};

export default ShapeChallenge;
