import React, { useEffect, useRef, useState } from 'react';
import { Point } from '@/types/shapes';
import { useBrushSystem } from '@/hooks/useBrushSystem';

interface GhostTrailReplayProps {
  points: Point[];
  targetCircle: { x: number; y: number; radius: number };
  showReplay: boolean;
  onReplayComplete?: () => void;
  replayDelay?: number;
}

const GhostTrailReplay: React.FC<GhostTrailReplayProps> = ({
  points,
  targetCircle,
  showReplay,
  onReplayComplete,
  replayDelay = 1000
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [replayProgress, setReplayProgress] = useState(0);
  const [isReplaying, setIsReplaying] = useState(false);
  const { getSelectedBrush } = useBrushSystem();
  
  const selectedBrush = getSelectedBrush();
  
  useEffect(() => {
    if (!showReplay || points.length === 0) {
      setIsReplaying(false);
      setReplayProgress(0);
      return;
    }
    
    const startReplay = () => {
      setIsReplaying(true);
      setReplayProgress(0);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Set canvas dimensions
      const rect = canvas.getBoundingClientRect();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - 70;
      
      const animateReplay = (startTime: number) => {
        const now = Date.now();
        const elapsed = now - startTime;
        const duration = 2000; // 2 seconds for full replay
        const progress = Math.min(elapsed / duration, 1);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate how many points to show
        const pointsToShow = Math.floor(progress * points.length);
        
        if (pointsToShow > 1) {
          // Set ghost trail style
          ctx.strokeStyle = selectedBrush.effectColor || '#765ED6';
          ctx.lineWidth = 4 * 0.7; // Slightly thinner for ghost effect
          ctx.globalAlpha = 0.6; // Semi-transparent
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          
          // Draw the replay trail
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          
          for (let i = 1; i < pointsToShow; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          
          ctx.stroke();
        }
        
        setReplayProgress(progress);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(() => animateReplay(startTime));
        } else {
          // Fade out effect
          setTimeout(() => {
            let opacity = 0.6;
            const fadeOut = () => {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              opacity -= 0.02;
              
              if (opacity > 0) {
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = selectedBrush.effectColor || '#765ED6';
                ctx.lineWidth = 4 * 0.7;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length; i++) {
                  ctx.lineTo(points[i].x, points[i].y);
                }
                
                ctx.stroke();
                
                requestAnimationFrame(fadeOut);
              } else {
                setIsReplaying(false);
                setReplayProgress(0);
                onReplayComplete?.();
              }
            };
            fadeOut();
          }, 500); // Hold replay for 500ms before fading
        }
      };
      
      animationRef.current = requestAnimationFrame(() => animateReplay(Date.now()));
    };
    
    // Start replay after delay
    const timeoutId = setTimeout(startReplay, replayDelay);
    
    return () => {
      clearTimeout(timeoutId);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showReplay, points, selectedBrush, replayDelay, onReplayComplete]);
  
  if (!showReplay || !isReplaying) {
    return null;
  }
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none z-20"
      style={{
        width: '100%',
        height: '100%',
        touchAction: 'none'
      }}
    />
  );
};

export default GhostTrailReplay;