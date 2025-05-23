
import React, { useRef, useEffect, useState } from 'react';
import { Point } from '@/types/shapes';
import { calculatePointToCircleDistance } from '@/utils/circleUtils';

interface ScoringOverlayProps {
  drawingPoints: Point[];
  targetCircle: {
    x: number;
    y: number;
    radius: number;
  };
  showSubmetrics: boolean;
  visible: boolean;
  fadeOpacity: number;
}

const ScoringOverlay: React.FC<ScoringOverlayProps> = ({
  drawingPoints,
  targetCircle,
  showSubmetrics,
  visible,
  fadeOpacity
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!visible) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = fadeOpacity;
    
    if (showSubmetrics && drawingPoints.length > 1) {
      drawSubmetrics(ctx, drawingPoints, targetCircle);
    }
    
    ctx.globalAlpha = 1;
  }, [drawingPoints, targetCircle, showSubmetrics, visible, fadeOpacity]);

  const drawSubmetrics = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    target: { x: number; y: number; radius: number }
  ) => {
    if (points.length < 3) return;

    // Calculate center of drawn points
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    // 1. Symmetry indicators - show points that deviate significantly from circular path
    drawSymmetryIndicators(ctx, points, { x: centerX, y: centerY }, target);
    
    // 2. Smoothness indicators - highlight sharp angle changes
    drawSmoothnessIndicators(ctx, points);
    
    // 3. Start/end alignment indicator
    drawAlignmentIndicator(ctx, points, target);
  };

  const drawSymmetryIndicators = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    center: { x: number; y: number },
    target: { x: number; y: number; radius: number }
  ) => {
    // Calculate average radius from center
    const radii = points.map(p => 
      Math.sqrt(Math.pow(p.x - center.x, 2) + Math.pow(p.y - center.y, 2))
    );
    const avgRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;
    
    // Highlight points that deviate significantly from average radius
    points.forEach((point, index) => {
      const radius = radii[index];
      const deviation = Math.abs(radius - avgRadius) / avgRadius;
      
      if (deviation > 0.15) { // 15% deviation threshold
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.strokeStyle = deviation > 0.3 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw line to ideal position
        const angle = Math.atan2(point.y - center.y, point.x - center.x);
        const idealX = center.x + avgRadius * Math.cos(angle);
        const idealY = center.y + avgRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(idealX, idealY);
        ctx.strokeStyle = 'rgba(118, 94, 216, 0.4)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  };

  const drawSmoothnessIndicators = (ctx: CanvasRenderingContext2D, points: Point[]) => {
    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      // Calculate angle between vectors
      const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
      const v2 = { x: next.x - curr.x, y: next.y - curr.y };
      
      const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
      const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
      
      if (mag1 > 0 && mag2 > 0) {
        const dot = (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2);
        const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
        
        // Highlight sharp turns (angle > 45 degrees)
        if (angle > Math.PI / 4) {
          ctx.beginPath();
          ctx.arc(curr.x, curr.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = angle > Math.PI / 2 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(245, 158, 11, 0.6)';
          ctx.fill();
        }
      }
    }
  };

  const drawAlignmentIndicator = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    target: { x: number; y: number; radius: number }
  ) => {
    if (points.length < 2) return;
    
    const start = points[0];
    const end = points[points.length - 1];
    
    // Calculate distance between start and end
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    
    // Show alignment indicator if gap is significant
    if (distance > target.radius * 0.1) { // 10% of radius threshold
      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = distance > target.radius * 0.2 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Mark start and end points
      [start, end].forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.strokeStyle = index === 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  };

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

export default ScoringOverlay;
