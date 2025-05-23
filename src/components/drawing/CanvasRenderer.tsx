
import React, { useRef, useEffect } from 'react';
import { Point } from '@/types/shapes';
import { DrawingMetrics } from '@/hooks/useDrawingState';

interface CanvasRendererProps {
  drawingPoints: Point[];
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
  showGhostCircle: boolean;
  strokeQuality: number;
}

const CanvasRenderer: React.FC<CanvasRendererProps> = ({ 
  drawingPoints, 
  targetCircle, 
  showGhostCircle, 
  strokeQuality 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Handle canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70; // Adjust for bottom nav
    
    // Clear canvas and redraw ghost circle if enabled
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (showGhostCircle && targetCircle) {
      ctx.beginPath();
      ctx.arc(targetCircle.x, targetCircle.y, targetCircle.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(118, 94, 216, 0.15)'; // Very faint purple color
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    if (drawingPoints.length > 1) {
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
  }, [drawingPoints, strokeQuality, showGhostCircle, targetCircle]);

  return (
    <canvas
      ref={canvasRef}
      className="touch-none"
    />
  );
};

export default CanvasRenderer;
