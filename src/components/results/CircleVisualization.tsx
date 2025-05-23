
import React, { useEffect, useRef } from 'react';

interface CircleVisualizationProps {
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  isGoodScore?: boolean;
  trailStyle?: string;
}

const CircleVisualization: React.FC<CircleVisualizationProps> = ({ 
  targetCircle, 
  drawnPoints,
  isGoodScore = false,
  trailStyle = 'stroke-primary stroke-2'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scale factor to fit the circle within the canvas
    const padding = 20;
    const maxRadius = Math.min(canvas.width, canvas.height) / 2 - padding;
    const scaleFactor = maxRadius / targetCircle.radius;
    
    // Center point of the canvas
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw the target circle
    ctx.beginPath();
    ctx.arc(
      centerX, 
      centerY, 
      targetCircle.radius * scaleFactor, 
      0, 
      2 * Math.PI
    );
    ctx.strokeStyle = 'rgba(79, 70, 229, 0.3)'; // Primary color with transparency
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Parse the stroke style from tailwind classes
    let strokeColor = '#4F46E5'; // Default primary color
    let strokeWidth = 2;
    
    if (trailStyle) {
      // Extract stroke color from the style string
      const colorMatch = trailStyle.match(/stroke-(\w+(?:-\d+)?)/);
      if (colorMatch) {
        let color = colorMatch[1];
        // Handle direct color values
        if (color.startsWith('#') || color.startsWith('rgb')) {
          strokeColor = color;
        } else if (color === 'primary') {
          strokeColor = '#4F46E5'; // Primary color
        } else if (color === 'white') {
          strokeColor = '#FFFFFF';
        } else if (color === 'indigo-900') {
          strokeColor = '#312E81';
        }
      }
      
      // Extract stroke width from the style string
      const widthMatch = trailStyle.match(/stroke-\[(\d+)px\]/);
      if (widthMatch) {
        strokeWidth = parseInt(widthMatch[1], 10);
      }
    }
    
    // Draw the user's drawn points
    if (drawnPoints.length > 1) {
      ctx.beginPath();
      
      // Scale and translate the first point
      const scaledX1 = (drawnPoints[0].x - (targetCircle.x - targetCircle.radius)) * scaleFactor;
      const scaledY1 = (drawnPoints[0].y - (targetCircle.y - targetCircle.radius)) * scaleFactor;
      
      ctx.moveTo(scaledX1, scaledY1);
      
      // Connect all the points
      for (let i = 1; i < drawnPoints.length; i++) {
        const scaledX = (drawnPoints[i].x - (targetCircle.x - targetCircle.radius)) * scaleFactor;
        const scaledY = (drawnPoints[i].y - (targetCircle.y - targetCircle.radius)) * scaleFactor;
        ctx.lineTo(scaledX, scaledY);
      }
      
      // Apply stroke style from props
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      
      // Apply glow effect for good scores
      if (isGoodScore) {
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 8;
      }
      
      ctx.stroke();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }, [targetCircle, drawnPoints, isGoodScore, trailStyle]);
  
  return (
    <canvas 
      ref={canvasRef}
      width={300}
      height={300}
      className="mx-auto rounded-lg border border-muted"
    />
  );
};

export default CircleVisualization;
