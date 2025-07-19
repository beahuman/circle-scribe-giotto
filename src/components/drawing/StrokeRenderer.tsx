
import React from 'react';
import { Point } from '@/types/shapes';
import { calculatePointToCircleDistance } from '@/utils/circleUtils';

interface StrokeRendererProps {
  ctx: CanvasRenderingContext2D;
  points: Point[];
  targetCircle: { x: number; y: number; radius: number };
  quality: number;
}

export const StrokeRenderer = {
  drawStrokeWithFeedback: (
    ctx: CanvasRenderingContext2D, 
    points: Point[], 
    targetCircle: { x: number; y: number; radius: number },
    quality: number
  ) => {
    if (points.length < 2) return;

    const baseLineWidth = 4;
    const lineWidth = baseLineWidth * (0.8 + quality * 0.4);
    
    // Draw the main stroke path
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
      
      // Visual feedback on accuracy for each segment
      if (i > 1) {
        const segmentFeedback = ctx.createLinearGradient(
          points[i-1].x, points[i-1].y, 
          points[i].x, points[i].y
        );
        
        // Calculate distance from ideal circle path
        const distanceTolerance = targetCircle.radius * 0.15; // 15% tolerance
        const prevDistance = Math.abs(calculatePointToCircleDistance(points[i-1], targetCircle) - targetCircle.radius);
        const currentDistance = Math.abs(calculatePointToCircleDistance(points[i], targetCircle) - targetCircle.radius);
        const avgDistance = (prevDistance + currentDistance) / 2;
        
        // Normalized accuracy (0 = perfect, 1 = totally off)
        const normalizedError = Math.min(1, avgDistance / distanceTolerance);
        
        // Generate color gradient based on accuracy
        if (normalizedError < 0.3) {
          // Good - green
          segmentFeedback.addColorStop(0, 'rgba(34, 197, 94, 0.9)');
          segmentFeedback.addColorStop(1, 'rgba(34, 197, 94, 0.9)');
        } else if (normalizedError < 0.7) {
          // Medium - yellow to amber
          segmentFeedback.addColorStop(0, 'rgba(245, 158, 11, 0.85)');
          segmentFeedback.addColorStop(1, 'rgba(245, 158, 11, 0.85)');
        } else {
          // Poor - red
          segmentFeedback.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
          segmentFeedback.addColorStop(1, 'rgba(239, 68, 68, 0.8)');
        }
        
        ctx.strokeStyle = segmentFeedback;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Draw just this segment with appropriate color
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(points[i-1].x, points[i-1].y);
        ctx.lineTo(points[i].x, points[i].y);
      }
    }
    
    ctx.stroke();
  }
};
