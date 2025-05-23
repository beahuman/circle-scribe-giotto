
import React, { useRef, useEffect } from 'react';
import { Point } from '@/types/shapes';
import { calculatePointToCircleDistance } from '@/utils/circleUtils';

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
  const animationRef = useRef<number | null>(null);
  const trailPointsRef = useRef<Point[]>([]);
  const lastDrawnPointsRef = useRef<number>(0);
  
  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle canvas rendering with animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Setup canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 70; // Adjust for bottom nav
    
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }

    // Reset trail if drawing is starting
    if (drawingPoints.length <= 1) {
      trailPointsRef.current = [];
      lastDrawnPointsRef.current = 0;
    }

    // Add new points to trail
    if (drawingPoints.length > lastDrawnPointsRef.current) {
      const newPoints = drawingPoints.slice(lastDrawnPointsRef.current);
      trailPointsRef.current = [...trailPointsRef.current, ...newPoints];
      lastDrawnPointsRef.current = drawingPoints.length;
    }

    // Animate the drawing
    let fadePoints: Point[] = [];
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the ghost circle if enabled
      if (showGhostCircle && targetCircle) {
        ctx.beginPath();
        ctx.arc(targetCircle.x, targetCircle.y, targetCircle.radius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(118, 94, 216, 0.15)'; // Very faint purple color
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Calculate optimal fade length
      const fadeLength = Math.min(30, Math.max(10, Math.floor(trailPointsRef.current.length * 0.25)));
      
      // Draw main stroke with quality feedback
      if (trailPointsRef.current.length > 1) {
        // Create a trail effect by gradually fading out points
        fadePoints = trailPointsRef.current.slice(-fadeLength);
        
        // Draw the main stroke
        drawStrokeWithFeedback(ctx, trailPointsRef.current, targetCircle, strokeQuality);
        
        // Add a soft glow for high quality strokes
        if (strokeQuality > 0.7) {
          ctx.shadowColor = 'rgba(118, 94, 216, 0.5)'; // Using direct color value
          ctx.shadowBlur = 8;
          drawTrailingEffect(ctx, fadePoints);
          ctx.shadowBlur = 0;
        } else {
          drawTrailingEffect(ctx, fadePoints);
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawingPoints, strokeQuality, showGhostCircle, targetCircle]);

  const drawStrokeWithFeedback = (
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
        
        // Generate color gradient based on accuracy - using direct color values instead of CSS variables
        if (normalizedError < 0.3) {
          // Good - green
          segmentFeedback.addColorStop(0, 'rgba(34, 197, 94, 0.9)'); // Success green
          segmentFeedback.addColorStop(1, 'rgba(34, 197, 94, 0.9)');
        } else if (normalizedError < 0.7) {
          // Medium - yellow to amber
          segmentFeedback.addColorStop(0, 'rgba(245, 158, 11, 0.85)'); // Amber
          segmentFeedback.addColorStop(1, 'rgba(245, 158, 11, 0.85)');
        } else {
          // Poor - red
          segmentFeedback.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // Red
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
  };

  const drawTrailingEffect = (ctx: CanvasRenderingContext2D, points: Point[]) => {
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
        ctx.fillStyle = `rgba(118, 94, 216, ${opacity * 0.5})`; // Using direct color value
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="touch-none absolute top-0 left-0 w-full h-full"
    />
  );
};

export default CanvasRenderer;
