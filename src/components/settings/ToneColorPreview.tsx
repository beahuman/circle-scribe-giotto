import React from 'react';
import { ToneType } from '@/utils/toneMessages';
import { useToneColorSystem } from '@/hooks/useToneColorSystem';

interface ToneColorPreviewProps {
  tone: ToneType;
  className?: string;
}

const ToneColorPreview: React.FC<ToneColorPreviewProps> = ({ tone, className = '' }) => {
  const { getToneColorScheme } = useToneColorSystem();
  const scheme = getToneColorScheme(tone);

  return (
    <div className={`relative rounded-lg overflow-hidden h-16 w-full ${className}`}>
      {/* Background gradient preview */}
      <div className={`absolute inset-0 bg-${scheme.background} opacity-90`} />
      
      {/* Accent color preview */}
      <div className={`absolute top-2 left-2 w-3 h-3 rounded-full bg-${scheme.accent.replace('text-', '')}`} />
      
      {/* Primary color preview */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-${scheme.primary.replace('text-', '')}`} />
      
      {/* Sample text in tone colors */}
      <div className={`absolute bottom-2 left-2 right-2 text-${scheme.text} text-xs opacity-80`}>
        {tone} tone preview
      </div>
    </div>
  );
};

export default ToneColorPreview;