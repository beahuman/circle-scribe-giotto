
import React from 'react';
import { useToneSystem } from '@/hooks/useToneSystem';
import { getTonePersonality } from '@/utils/tonePersonality';

interface ToneAwareTextProps {
  variant: 'settings' | 'locked' | 'nav-alt' | 'modal-helper';
  fallback: string;
  className?: string;
}

const ToneAwareText: React.FC<ToneAwareTextProps> = ({
  variant,
  fallback,
  className = ''
}) => {
  const { selectedTone } = useToneSystem();
  const personality = getTonePersonality(selectedTone);
  
  const getText = () => {
    switch (variant) {
      case 'settings':
        return personality.settingsCopy;
      case 'locked':
        return personality.lockedModeText;
      case 'nav-alt':
        return personality.navAltLabel;
      case 'modal-helper':
        return personality.modalHelper;
      default:
        return fallback;
    }
  };

  return (
    <span className={className}>
      {getText()}
    </span>
  );
};

export default ToneAwareText;
