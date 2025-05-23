
import React from 'react';
import { cn } from '@/lib/utils';

interface InstructionOverlayProps {
  visible: boolean;
  message?: string;
  position?: 'top' | 'middle' | 'bottom';
  variant?: 'primary' | 'secondary' | 'success' | 'warning';
  className?: string;
  animateIn?: boolean;
}

const InstructionOverlay: React.FC<InstructionOverlayProps> = ({ 
  visible, 
  message = 'Draw the circle', 
  position = 'top',
  variant = 'primary',
  className = '',
  animateIn = true
}) => {
  if (!visible) {
    return null;
  }

  const positionClasses = {
    top: 'top-6 inset-x-0',
    middle: 'top-1/2 -translate-y-1/2 inset-x-0', 
    bottom: 'bottom-20 inset-x-0'
  };

  const variantClasses = {
    primary: 'bg-[#765ED8] text-white',
    secondary: 'bg-gray-800 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white'
  };

  return (
    <div className={cn(
      "fixed mx-auto w-fit px-6 py-2 rounded-full backdrop-blur-sm",
      positionClasses[position],
      variantClasses[variant],
      animateIn && "animate-fade-in",
      className
    )}>
      <span className="text-lg font-medium block text-center">{message}</span>
    </div>
  );
};

export default InstructionOverlay;
