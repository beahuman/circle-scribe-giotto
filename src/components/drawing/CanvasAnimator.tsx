
import React, { useRef } from 'react';
import { Point } from '@/types/shapes';
import { StrokeRenderer } from './StrokeRenderer';
import { TrailingEffect } from './TrailingEffect';

interface CanvasAnimatorProps {
  canvas: HTMLCanvasElement;
  trailPointsRef: React.MutableRefObject<Point[]>;
  targetCircle: { x: number; y: number; radius: number };
  strokeQuality: number;
  showGhostCircle: boolean;
  showCompletedDrawing: boolean;
  fadeOpacity: number;
}

export const CanvasAnimator = {
  startAnimation: ({
    canvas,
    trailPointsRef,
    targetCircle,
    strokeQuality,
    showGhostCircle,
    showCompletedDrawing,
    fadeOpacity
  }: CanvasAnimatorProps) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let animationId: number | null = null;
    let fadePoints: Point[] = [];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply fade opacity for completed drawings
      ctx.globalAlpha = showCompletedDrawing ? fadeOpacity : 1;
      
      // Draw the target circle if we're showing completed drawing or ghost circle is enabled
      if ((showCompletedDrawing || showGhostCircle) && targetCircle) {
        ctx.beginPath();
        ctx.arc(targetCircle.x, targetCircle.y, targetCircle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = showCompletedDrawing ? 
          'rgba(118, 94, 216, 0.4)' : // More visible when showing completed drawing
          'rgba(118, 94, 216, 0.15)'; // Very faint for ghost circle
        ctx.lineWidth = showCompletedDrawing ? 3 : 2;
        ctx.stroke();
      }
      
      // Calculate optimal fade length
      const fadeLength = Math.min(30, Math.max(10, Math.floor(trailPointsRef.current.length * 0.25)));
      
      // Draw main stroke with quality feedback
      if (trailPointsRef.current.length > 1) {
        // Create a trail effect by gradually fading out points
        fadePoints = trailPointsRef.current.slice(-fadeLength);
        
        // Draw the main stroke
        StrokeRenderer.drawStrokeWithFeedback(ctx, trailPointsRef.current, targetCircle, strokeQuality);
        
        // Add a soft glow for high quality strokes
        if (strokeQuality > 0.7) {
          ctx.shadowColor = 'rgba(118, 94, 216, 0.5)';
          ctx.shadowBlur = 8;
          TrailingEffect.drawTrailingEffect(ctx, fadePoints);
          ctx.shadowBlur = 0;
        } else {
          TrailingEffect.drawTrailingEffect(ctx, fadePoints);
        }
      }
      
      // Reset global alpha
      ctx.globalAlpha = 1;
      
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
