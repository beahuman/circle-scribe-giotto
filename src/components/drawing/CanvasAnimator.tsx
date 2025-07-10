
import React, { useRef } from 'react';
import { Point } from '@/types/shapes';
import { BrushStyle } from '@/types/brushes';

interface CanvasAnimatorProps {
  canvas: HTMLCanvasElement;
  trailPointsRef: React.MutableRefObject<Point[]>;
  targetCircle: { x: number; y: number; radius: number };
  strokeQuality: number;
  showGhostCircle: boolean;
  showCompletedDrawing: boolean;
  fadeOpacity: number;
  brushStyle?: BrushStyle;
}

export const CanvasAnimator = {
  startAnimation: ({
    canvas,
    trailPointsRef,
    targetCircle,
    strokeQuality,
    showGhostCircle,
    showCompletedDrawing,
    fadeOpacity,
    brushStyle
  }: CanvasAnimatorProps) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let animationId: number | null = null;
    let lastDrawnLength = 0;

    // Optimize canvas settings for performance
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    const drawOptimizedStroke = (points: Point[]) => {
      if (points.length < 2) return;

      // Use brush style if provided, otherwise fall back to default
      if (brushStyle) {
        brushStyle.renderStroke(ctx, points, strokeQuality, showCompletedDrawing);
      } else {
        // Default stroke rendering
        const baseLineWidth = 4;
        const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
        
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        // Use quadratic curves for smoother appearance without lag
        for (let i = 1; i < points.length - 1; i++) {
          const current = points[i];
          const next = points[i + 1];
          const midX = (current.x + next.x) / 2;
          const midY = (current.y + next.y) / 2;
          
          ctx.quadraticCurveTo(current.x, current.y, midX, midY);
        }
        
        // Draw to the last point
        if (points.length > 1) {
          const lastPoint = points[points.length - 1];
          ctx.lineTo(lastPoint.x, lastPoint.y);
        }
        
        // Dynamic color based on quality
        const alpha = 0.8 + strokeQuality * 0.2;
        ctx.strokeStyle = `rgba(118, 94, 216, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };

    const animate = () => {
      // Only clear and redraw when needed to reduce GPU load
      const currentLength = trailPointsRef.current.length;
      const needsUpdate = currentLength !== lastDrawnLength || showCompletedDrawing;
      
      if (needsUpdate) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply fade opacity for completed drawings
        ctx.globalAlpha = showCompletedDrawing ? fadeOpacity : 1;
        
        // Draw ghost circle with minimal impact
        if ((showCompletedDrawing || showGhostCircle) && targetCircle) {
          console.log('CanvasAnimator - Drawing ghost circle at:', targetCircle);
          console.log('CanvasAnimator - Canvas dimensions:', { width: canvas.width, height: canvas.height });
          ctx.beginPath();
          ctx.arc(targetCircle.x, targetCircle.y, targetCircle.radius, 0, Math.PI * 2);
          ctx.strokeStyle = showCompletedDrawing ? 
            'rgba(118, 94, 216, 0.4)' : 
            'rgba(118, 94, 216, 0.15)';
          ctx.lineWidth = showCompletedDrawing ? 3 : 2;
          ctx.stroke();
        }
        
        // Draw the main stroke with optimized rendering
        if (trailPointsRef.current.length > 1) {
          drawOptimizedStroke(trailPointsRef.current);
          
          // Add subtle glow for high quality strokes without performance impact
          if (strokeQuality > 0.8 && !showCompletedDrawing) {
            ctx.shadowColor = 'rgba(118, 94, 216, 0.3)';
            ctx.shadowBlur = 4;
            drawOptimizedStroke(trailPointsRef.current);
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';
          }
        }
        
        ctx.globalAlpha = 1;
        lastDrawnLength = currentLength;
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }
};
