
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useToneSystem } from '@/hooks/useToneSystem';
import { getTonePersonality } from '@/utils/tonePersonality';

interface ToneAwareButtonProps extends ButtonProps {
  baseText: string;
  toneVariant?: 'retry' | 'encouragement';
}

const ToneAwareButton: React.FC<ToneAwareButtonProps> = ({
  baseText,
  toneVariant = 'retry',
  children,
  ...props
}) => {
  const { selectedTone } = useToneSystem();
  const personality = getTonePersonality(selectedTone);
  
  const getButtonText = () => {
    if (children) return children;
    
    switch (toneVariant) {
      case 'retry':
        return personality.ctaRetry;
      case 'encouragement':
        return personality.encouragement;
      default:
        return baseText;
    }
  };

  return (
    <Button {...props}>
      {getButtonText()}
    </Button>
  );
};

export default ToneAwareButton;
