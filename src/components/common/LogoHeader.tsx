import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoAnimation from '../LogoAnimation';

interface LogoHeaderProps {
  position?: 'center' | 'left';
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  className?: string;
  customSize?: number; // Custom size in pixels
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ 
  position = 'center', 
  size = 'medium',
  clickable = true,
  className = '',
  customSize
}) => {
  const navigate = useNavigate();

  const getSizePixels = () => {
    if (customSize) return customSize;
    switch (size) {
      case 'small': return 56;  // Standardized small size
      case 'medium': return 96; // Standardized medium size
      case 'large': return 128; // Standardized large size
      default: return 96;
    }
  };

  const positionClasses = {
    center: 'mx-auto',
    left: 'ml-0'
  };

  const handleClick = () => {
    if (clickable) {
      navigate('/');
    }
  };

  const logoSize = getSizePixels();
  
  return (
    <div 
      className={`${positionClasses[position]} ${clickable ? 'logo-clickable cursor-pointer' : ''} ${className}`}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
    >
      <LogoAnimation size={logoSize} />
    </div>
  );
};

export default LogoHeader;