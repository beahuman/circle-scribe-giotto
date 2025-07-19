import React, { useEffect } from 'react';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useToneColorSystem } from '@/hooks/useToneColorSystem';

interface ToneAwareBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'surface' | 'subtle';
}

const ToneAwareBackground: React.FC<ToneAwareBackgroundProps> = ({ 
  children, 
  className = '',
  variant = 'default'
}) => {
  const { selectedTone } = useToneSystem();
  const { getToneBackgroundClasses, getToneSurfaceClasses, applyToneToElement } = useToneColorSystem();
  
  useEffect(() => {
    // Apply tone colors to body element for global theming
    applyToneToElement(document.body, selectedTone);
  }, [selectedTone, applyToneToElement]);

  const getBackgroundClasses = () => {
    switch (variant) {
      case 'surface':
        return getToneSurfaceClasses(selectedTone);
      case 'subtle':
        return 'bg-background/50';
      default:
        return getToneBackgroundClasses(selectedTone);
    }
  };

  return (
    <div className={`${getBackgroundClasses()} ${className}`}>
      {children}
    </div>
  );
};

export default ToneAwareBackground;