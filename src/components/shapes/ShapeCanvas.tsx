
import React, { useRef, useEffect } from 'react';
import { Point, TargetShape } from '@/types/shapes';

interface ShapeCanvasProps {
  points: Point[];
  targetShape: TargetShape;
  showingTargetShape: boolean;
}

const ShapeCanvas: React.FC<ShapeCanvasProps> = ({ 
  points, 
  targetShape, 
  showingTargetShape 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
      
      ctx.strokeStyle = 'rgba(118, 94, 216, 0.6)'; // Using direct color value instead of CSS variable
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
    } else if (!showingTargetShape && points.length > 0) {
      // Draw user's drawn shape
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.strokeStyle = 'rgb(118, 94, 216)'; // Using direct color value instead of CSS variable
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
  }, [targetShape, showingTargetShape, points]);
  
  return <canvas ref={canvasRef} className="touch-none" />;
};

export default ShapeCanvas;
