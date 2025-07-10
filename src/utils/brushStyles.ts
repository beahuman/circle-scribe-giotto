import { BrushStyle } from '@/types/brushes';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';

export const BRUSH_STYLES: BrushStyle[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Clean, simple strokes',
    unlockCondition: 'Always available',
    isUnlocked: () => true,
    renderStroke: (ctx, points, strokeQuality) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 4;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
      const alpha = 0.8 + strokeQuality * 0.2;
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      if (points.length > 1) {
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }
      
      ctx.strokeStyle = `rgba(118, 94, 216, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  },
  
  {
    id: 'graphite',
    name: 'Graphite',
    description: 'Textured pencil strokes with subtle grain',
    unlockCondition: '3-day streak',
    isUnlocked: (progress) => {
      const streak = Number(localStorage.getItem('currentStreak')) || 0;
      return streak >= 3;
    },
    renderStroke: (ctx, points, strokeQuality) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 4;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
      const alpha = 0.7 + strokeQuality * 0.2;
      
      // Create texture pattern
      ctx.save();
      
      // Main stroke
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        // Add slight jitter for pencil texture
        const jitterX = (Math.random() - 0.5) * 0.5;
        const jitterY = (Math.random() - 0.5) * 0.5;
        ctx.lineTo(point.x + jitterX, point.y + jitterY);
      }
      
      ctx.strokeStyle = `rgba(80, 80, 80, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      ctx.restore();
    },
    effectColor: 'rgba(80, 80, 80, 0.8)'
  },
  
  {
    id: 'glowline',
    name: 'Glowline',
    description: 'Luminous strokes with gentle pulsing',
    unlockCondition: 'Score 90%+ in Daily Calibration',
    isUnlocked: (progress) => {
      const bestDaily = Number(localStorage.getItem('bestDailyCalibrationScore')) || 0;
      return bestDaily >= 90;
    },
    renderStroke: (ctx, points, strokeQuality, isComplete = false) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 4;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
      const pulseIntensity = isComplete ? 1 : 0.8 + Math.sin(Date.now() / 500) * 0.2;
      const alpha = (0.9 + strokeQuality * 0.1) * pulseIntensity;
      
      ctx.save();
      
      // Glow effect
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 8 * pulseIntensity;
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      if (points.length > 1) {
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }
      
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      ctx.restore();
    },
    effectColor: 'rgba(255, 255, 255, 0.9)',
    animationDuration: 2000
  },
  
  {
    id: 'waterink',
    name: 'Water Ink',
    description: 'Flowing ink with bleeding edges',
    unlockCondition: 'Earn "Ink Wash" theme',
    isUnlocked: (progress) => {
      const toneUsage = JSON.parse(localStorage.getItem('toneUsageStats') || '{}');
      return (toneUsage.meditative || 0) >= 10;
    },
    renderStroke: (ctx, points, strokeQuality) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 4;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
      const alpha = 0.6 + strokeQuality * 0.3;
      
      ctx.save();
      
      // Create ink bleeding effect
      ctx.shadowColor = 'rgba(118, 94, 216, 0.3)';
      ctx.shadowBlur = 12;
      
      // Draw multiple layers for depth
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length - 1; i++) {
          const current = points[i];
          const next = points[i + 1];
          const midX = (current.x + next.x) / 2;
          const midY = (current.y + next.y) / 2;
          ctx.quadraticCurveTo(current.x, current.y, midX, midY);
        }
        
        if (points.length > 1) {
          ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        }
        
        const layerAlpha = alpha * (1 - layer * 0.2);
        const layerWidth = lineWidth * (1 + layer * 0.3);
        
        ctx.strokeStyle = `rgba(118, 94, 216, ${layerAlpha})`;
        ctx.lineWidth = layerWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }
      
      ctx.restore();
    },
    effectColor: 'rgba(118, 94, 216, 0.6)'
  },
  
  {
    id: 'lasertrace',
    name: 'Laser Trace',
    description: 'Precise neon lines with electric energy',
    unlockCondition: 'Complete Blind Draw Mode 5x',
    isUnlocked: (progress) => {
      const blindDrawStats = JSON.parse(localStorage.getItem('blindDrawStats') || '{"completions": 0}');
      return blindDrawStats.completions >= 5;
    },
    renderStroke: (ctx, points, strokeQuality, isComplete = false) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 2.5;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
      const pulseIntensity = 1 + Math.sin(Date.now() / 200) * 0.3;
      const alpha = 0.9 + strokeQuality * 0.1;
      
      ctx.save();
      
      // Electric glow
      ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
      ctx.shadowBlur = 6 * pulseIntensity;
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      // Draw sharp, precise lines
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      // Add inner bright core
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.lineWidth = lineWidth * 0.3;
      ctx.stroke();
      
      ctx.restore();
    },
    effectColor: 'rgba(0, 255, 255, 0.9)',
    animationDuration: 1500
  },
  
  {
    id: 'brushstroke',
    name: 'Brushstroke',
    description: 'Natural brush with organic variation',
    unlockCondition: '10 draws with Meditative Tone',
    isUnlocked: (progress) => {
      const toneUsage = JSON.parse(localStorage.getItem('toneUsageStats') || '{}');
      return (toneUsage.meditative || 0) >= 10;
    },
    renderStroke: (ctx, points, strokeQuality) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 4;
      const alpha = 0.8 + strokeQuality * 0.2;
      
      ctx.save();
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        // Vary line width for natural brush effect
        const pressure = 0.8 + Math.sin(i * 0.1) * 0.3;
        const currentWidth = baseLineWidth * pressure * (0.8 + strokeQuality * 0.4);
        
        ctx.lineWidth = currentWidth;
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
      }
      
      ctx.strokeStyle = `rgba(139, 69, 19, ${alpha})`;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.restore();
    },
    effectColor: 'rgba(139, 69, 19, 0.8)'
  },
  
  {
    id: 'ghostpen',
    name: 'Ghost Pen',
    description: 'Ethereal traces that solidify on completion',
    unlockCondition: 'Use Formal tone 10x',
    isUnlocked: (progress) => {
      const toneUsage = JSON.parse(localStorage.getItem('toneUsageStats') || '{}');
      return (toneUsage.formal || 0) >= 10;
    },
    renderStroke: (ctx, points, strokeQuality, isComplete = false) => {
      if (points.length < 2) return;
      
      const baseLineWidth = 4;
      const lineWidth = baseLineWidth * (0.8 + strokeQuality * 0.4);
      const alpha = isComplete ? 0.9 + strokeQuality * 0.1 : 0.3 + strokeQuality * 0.2;
      
      ctx.save();
      
      if (isComplete) {
        // Flash effect on completion
        ctx.shadowColor = 'rgba(200, 200, 200, 0.8)';
        ctx.shadowBlur = 8;
      }
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        const midX = (current.x + next.x) / 2;
        const midY = (current.y + next.y) / 2;
        ctx.quadraticCurveTo(current.x, current.y, midX, midY);
      }
      
      if (points.length > 1) {
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }
      
      ctx.strokeStyle = `rgba(200, 200, 200, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      
      ctx.restore();
    },
    effectColor: 'rgba(200, 200, 200, 0.7)'
  }
];

export const getBrushById = (id: string): BrushStyle | undefined => {
  return BRUSH_STYLES.find(brush => brush.id === id);
};

export const getUnlockedBrushes = (): BrushStyle[] => {
  return BRUSH_STYLES.filter(brush => brush.isUnlocked({}));
};