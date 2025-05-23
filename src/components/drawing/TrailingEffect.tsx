
import React from 'react';
import { Point } from '@/types/shapes';

export const TrailingEffect = {
  drawTrailingEffect: (ctx: CanvasRenderingContext2D, points: Point[]) => {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
      
      // Calculate opacity based on position in trail (newer points = more opaque)
      const opacity = i / points.length;
      const size = 2 + (opacity * 6); // Size increases toward the end
      
      // Draw glow dots at key points for trailing effect
      if (i % 3 === 0) { // Every 3rd point
        ctx.fillStyle = `rgba(118, 94, 216, ${opacity * 0.5})`;
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};
