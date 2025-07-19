import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Point } from '@/types/shapes';

interface CircleOverlayProps {
  drawnPoints: Point[];
  targetCircle: { x: number; y: number; radius: number };
  showDeviations?: boolean;
  className?: string;
}

const CircleOverlay: React.FC<CircleOverlayProps> = ({
  drawnPoints,
  targetCircle,
  showDeviations = true,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerSize = 300;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !drawnPoints.length) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = containerSize;
    canvas.height = containerSize;
    
    ctx.clearRect(0, 0, containerSize, containerSize);
    
    // Calculate scaling and centering
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const displayRadius = Math.min(containerSize * 0.35, 120);
    
    // Draw perfect reference circle (subtle)
    ctx.beginPath();
    ctx.arc(centerX, centerY, displayRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(118, 94, 216, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Calculate bounds and scale for drawn circle
    if (drawnPoints.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      drawnPoints.forEach(point => {
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
        (displayRadius * 2) / (drawnWidth || 1),
        (displayRadius * 2) / (drawnHeight || 1)
      ) * 0.9;
      
      // Transform drawn points to display coordinates
      const transformedPoints = drawnPoints.map(point => ({
        x: centerX + (point.x - drawnCenterX) * scaleFactor,
        y: centerY + (point.y - drawnCenterY) * scaleFactor
      }));
      
      // Draw user's circle
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
      
      // Show deviation indicators if enabled
      if (showDeviations) {
        transformedPoints.forEach((point, index) => {
          if (index % 3 !== 0) return; // Sample every 3rd point
          
          const distanceFromCenter = Math.sqrt(
            Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
          );
          const deviation = Math.abs(distanceFromCenter - displayRadius);
          
          if (deviation > 5) { // Only show significant deviations
            // Draw deviation indicator
            ctx.beginPath();
            ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = deviation > 15 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)';
            ctx.fill();
            
            // Draw line to perfect position
            const angle = Math.atan2(point.y - centerY, point.x - centerX);
            const perfectX = centerX + displayRadius * Math.cos(angle);
            const perfectY = centerY + displayRadius * Math.sin(angle);
            
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(perfectX, perfectY);
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }
    }
  }, [drawnPoints, targetCircle, showDeviations]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
    >
      <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg p-6 border shadow-sm">
        <canvas
          ref={canvasRef}
          width={containerSize}
          height={containerSize}
          className="w-full h-auto max-w-[300px] max-h-[300px]"
        />
        
        <div className="mt-4 text-center space-y-1">
          <p className="text-sm font-medium">Your Circle vs Perfect</p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-primary rounded"></div>
              <span>Your drawing</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 border border-primary/50 border-dashed rounded"></div>
              <span>Perfect circle</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CircleOverlay;