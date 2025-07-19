import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Point } from '@/types/shapes';
import { GeometricSubscores } from '@/utils/scoring/geometricScoring';

interface CircleComparisonProps {
  drawnPoints: Point[];
  targetCircle: { x: number; y: number; radius: number };
  showAdvancedOverlay: boolean;
  onToggleOverlay: () => void;
  subscores?: GeometricSubscores | null;
}

const CircleComparison: React.FC<CircleComparisonProps> = ({
  drawnPoints,
  targetCircle,
  showAdvancedOverlay,
  onToggleOverlay,
  subscores
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'overlay' | 'side-by-side'>('overlay');
  const containerSize = 320;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !drawnPoints.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = containerSize;
    canvas.height = containerSize;
    ctx.clearRect(0, 0, containerSize, containerSize);

    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const displayRadius = Math.min(containerSize * 0.35, 110);

    if (viewMode === 'overlay') {
      drawOverlayView(ctx, centerX, centerY, displayRadius);
    } else {
      drawSideBySideView(ctx, centerX, centerY, displayRadius);
    }
  }, [drawnPoints, targetCircle, showAdvancedOverlay, viewMode, subscores]);

  const drawOverlayView = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, displayRadius: number) => {
    // Draw perfect reference circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, displayRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(118, 94, 216, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Transform and draw user's circle
    const transformedPoints = transformPointsToDisplay(drawnPoints, centerX, centerY, displayRadius);
    
    if (showAdvancedOverlay) {
      drawAdvancedOverlay(ctx, transformedPoints, centerX, centerY, displayRadius);
    } else {
      drawUserCircle(ctx, transformedPoints);
    }
  };

  const drawSideBySideView = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, displayRadius: number) => {
    const leftCenter = containerSize * 0.25;
    const rightCenter = containerSize * 0.75;
    const radius = displayRadius * 0.7;

    // Left side - Perfect circle
    ctx.beginPath();
    ctx.arc(leftCenter, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(118, 94, 216, 0.8)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Right side - User's circle
    const transformedPoints = transformPointsToDisplay(drawnPoints, rightCenter, centerY, radius);
    drawUserCircle(ctx, transformedPoints);

    // Labels
    ctx.fillStyle = 'rgba(118, 94, 216, 0.7)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Perfect', leftCenter, centerY + radius + 20);
    ctx.fillText('Your Drawing', rightCenter, centerY + radius + 20);
  };

  const transformPointsToDisplay = (points: Point[], centerX: number, centerY: number, radius: number) => {
    if (!points.length) return [];

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    points.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });

    const drawnWidth = maxX - minX;
    const drawnHeight = maxY - minY;
    const drawnCenterX = minX + drawnWidth / 2;
    const drawnCenterY = minY + drawnHeight / 2;

    const scaleFactor = Math.min(
      (radius * 2) / (drawnWidth || 1),
      (radius * 2) / (drawnHeight || 1)
    ) * 0.9;

    return points.map(point => ({
      x: centerX + (point.x - drawnCenterX) * scaleFactor,
      y: centerY + (point.y - drawnCenterY) * scaleFactor
    }));
  };

  const drawUserCircle = (ctx: CanvasRenderingContext2D, transformedPoints: Point[]) => {
    if (!transformedPoints.length) return;

    ctx.beginPath();
    ctx.moveTo(transformedPoints[0].x, transformedPoints[0].y);
    transformedPoints.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = 'hsl(var(--primary))';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const drawAdvancedOverlay = (ctx: CanvasRenderingContext2D, transformedPoints: Point[], centerX: number, centerY: number, displayRadius: number) => {
    // Draw heatmap for precision zones
    transformedPoints.forEach((point, index) => {
      if (index % 2 !== 0) return; // Sample every other point

      const distanceFromCenter = Math.sqrt(
        Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
      );
      const deviation = Math.abs(distanceFromCenter - displayRadius);
      const normalizedDeviation = Math.min(1, deviation / (displayRadius * 0.2));

      // Color based on precision
      let color;
      if (normalizedDeviation < 0.3) {
        color = `rgba(34, 197, 94, ${0.8 - normalizedDeviation})`;  // Green for good
      } else if (normalizedDeviation < 0.6) {
        color = `rgba(245, 158, 11, ${0.8 - normalizedDeviation * 0.5})`;  // Yellow for okay
      } else {
        color = `rgba(239, 68, 68, ${0.6})`;  // Red for poor
      }

      // Draw precision indicator
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4 + normalizedDeviation * 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Add glow effect for high precision areas
      if (normalizedDeviation < 0.2) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.fill();
      }
    });

    // Draw user's circle path
    drawUserCircle(ctx, transformedPoints);

    // Show start/end alignment if there's significant offset
    if ((subscores?.completionOffset ?? 100) < 85 && transformedPoints.length > 1) {
      const startPoint = transformedPoints[0];
      const endPoint = transformedPoints[transformedPoints.length - 1];

      // Draw alignment arrow
      ctx.beginPath();
      ctx.moveTo(endPoint.x, endPoint.y);
      ctx.lineTo(startPoint.x, startPoint.y);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw arrow head
      const angle = Math.atan2(startPoint.y - endPoint.y, startPoint.x - endPoint.x);
      const arrowLength = 8;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(
        startPoint.x - arrowLength * Math.cos(angle - Math.PI / 6),
        startPoint.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(
        startPoint.x - arrowLength * Math.cos(angle + Math.PI / 6),
        startPoint.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-background to-muted/20 rounded-lg p-6 border shadow-sm"
    >
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('overlay')}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              viewMode === 'overlay' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              viewMode === 'side-by-side' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Side by Side
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleOverlay}
          className="flex items-center gap-1 px-3 py-1 bg-muted/50 hover:bg-muted/70 rounded-md transition-colors"
        >
          {showAdvancedOverlay ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          <span className="text-xs">
            {showAdvancedOverlay ? 'Hide' : 'Show'} Analysis
          </span>
        </motion.button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={containerSize}
        height={containerSize}
        className="w-full h-auto max-w-[320px] max-h-[320px] mx-auto"
      />

      {/* Legend */}
      <AnimatePresence>
        {showAdvancedOverlay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            <p className="text-xs font-medium text-center">Analysis Legend</p>
            <div className="flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>High Precision</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Needs Work</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CircleComparison;