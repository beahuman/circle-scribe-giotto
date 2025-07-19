
import React, { useRef, useEffect, useState } from 'react';
import { Point } from '@/types/shapes';
import { calculateGeometricScore, GeometricSubscores } from '@/utils/circleUtils';

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
  difficultyLevel?: number;
  isPenaltyMode?: boolean;
}

const ScoringOverlay: React.FC<ScoringOverlayProps> = ({
  drawingPoints,
  targetCircle,
  showSubmetrics,
  visible,
  fadeOpacity,
  difficultyLevel = 50,
  isPenaltyMode = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [subscores, setSubscores] = useState<GeometricSubscores | null>(null);

  useEffect(() => {
    if (!visible || drawingPoints.length < 3) return;
    
    // Calculate subscores using the geometric scoring system
    const newSubscores = calculateGeometricScore(
      drawingPoints, 
      targetCircle, 
      difficultyLevel, 
      isPenaltyMode
    );
    setSubscores(newSubscores);
  }, [drawingPoints, targetCircle, difficultyLevel, isPenaltyMode, visible]);

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
    
    if (showSubmetrics && drawingPoints.length > 1 && subscores) {
      drawGeometricFeedback(ctx, drawingPoints, targetCircle, subscores);
    }
    
    ctx.globalAlpha = 1;
  }, [drawingPoints, targetCircle, showSubmetrics, visible, fadeOpacity, subscores]);

  const drawGeometricFeedback = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    target: { x: number; y: number; radius: number },
    subscores: GeometricSubscores
  ) => {
    if (points.length < 3) return;

    // 1. Stroke deviation indicators
    drawDeviationIndicators(ctx, points, target, subscores.strokeDeviation);
    
    // 2. Angular smoothness indicators
    drawSmoothnessIndicators(ctx, points, subscores.angularSmoothness);
    
    // 3. Completion offset indicator
    drawCompletionIndicator(ctx, points, target, subscores.completionOffset);
    
    // 4. Display numeric subscores
    drawSubscoreDisplay(ctx, subscores);
  };

  const drawDeviationIndicators = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    target: { x: number; y: number; radius: number },
    deviationScore: number
  ) => {
    // Color based on deviation score
    const getDeviationColor = (score: number) => {
      if (score >= 90) return 'rgba(34, 197, 94, 0.8)';   // Green - excellent
      if (score >= 75) return 'rgba(59, 130, 246, 0.8)';  // Blue - good
      if (score >= 50) return 'rgba(245, 158, 11, 0.8)';  // Yellow - fair
      return 'rgba(239, 68, 68, 0.8)';                    // Red - poor
    };

    points.forEach((point, index) => {
      if (index % 3 !== 0) return; // Sample every 3rd point for performance
      
      const distanceToCenter = Math.sqrt(
        Math.pow(point.x - target.x, 2) + Math.pow(point.y - target.y, 2)
      );
      const deviation = Math.abs(distanceToCenter - target.radius);
      const normalizedDeviation = deviation / target.radius;
      
      // Only show indicator if deviation is significant
      if (normalizedDeviation > 0.05) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = getDeviationColor(deviationScore);
        ctx.fill();
        
        // Draw line to ideal position on circle
        const angle = Math.atan2(point.y - target.y, point.x - target.x);
        const idealX = target.x + target.radius * Math.cos(angle);
        const idealY = target.y + target.radius * Math.sin(angle);
        
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

  const drawSmoothnessIndicators = (
    ctx: CanvasRenderingContext2D, 
    points: Point[], 
    smoothnessScore: number
  ) => {
    const getSmoothnessColor = (score: number) => {
      if (score >= 90) return 'rgba(34, 197, 94, 0.6)';   // Green - smooth
      if (score >= 75) return 'rgba(59, 130, 246, 0.6)';  // Blue - good
      if (score >= 50) return 'rgba(245, 158, 11, 0.6)';  // Yellow - fair
      return 'rgba(239, 68, 68, 0.6)';                    // Red - jagged
    };

    for (let i = 1; i < points.length - 1; i += 2) { // Sample every other point
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
        const angleInDegrees = (angle * 180) / Math.PI;
        
        // Highlight sharp angle changes
        if (angleInDegrees > 30) {
          ctx.beginPath();
          ctx.arc(curr.x, curr.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = getSmoothnessColor(smoothnessScore);
          ctx.fill();
        }
      }
    }
  };

  const drawCompletionIndicator = (
    ctx: CanvasRenderingContext2D,
    points: Point[],
    target: { x: number; y: number; radius: number },
    completionScore: number
  ) => {
    if (points.length < 2) return;
    
    const start = points[0];
    const end = points[points.length - 1];
    
    const gapDistance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    
    const getCompletionColor = (score: number) => {
      if (score >= 90) return 'rgba(34, 197, 94, 0.8)';   // Green - well closed
      if (score >= 75) return 'rgba(59, 130, 246, 0.8)';  // Blue - good
      if (score >= 50) return 'rgba(245, 158, 11, 0.8)';  // Yellow - fair
      return 'rgba(239, 68, 68, 0.8)';                    // Red - poor closure
    };
    
    // Show gap if significant
    if (gapDistance > target.radius * 0.05) {
      // Draw connection line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = getCompletionColor(completionScore);
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Mark start and end points
      [start, end].forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.strokeStyle = index === 0 ? 'rgba(34, 197, 94, 0.8)' : getCompletionColor(completionScore);
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  };

  const drawSubscoreDisplay = (ctx: CanvasRenderingContext2D, subscores: GeometricSubscores) => {
    const margin = 20;
    const lineHeight = 20;
    const startY = 30;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(margin - 10, startY - 15, 200, 80);
    
    ctx.font = '12px system-ui';
    ctx.fillStyle = 'white';
    
    ctx.fillText(`Deviation: ${subscores.strokeDeviation.toFixed(1)}%`, margin, startY);
    ctx.fillText(`Smoothness: ${subscores.angularSmoothness.toFixed(1)}%`, margin, startY + lineHeight);
    ctx.fillText(`Completion: ${subscores.completionOffset.toFixed(1)}%`, margin, startY + lineHeight * 2);
    ctx.fillText(`Overall: ${subscores.overallScore.toFixed(1)}%`, margin, startY + lineHeight * 3);
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
