import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoAnimation from '../LogoAnimation';

interface LogoHeaderProps {
  position?: 'center' | 'left';
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  className?: string;
}

const LogoHeader: React.FC<LogoHeaderProps> = ({ 
  position = 'center', 
  size = 'medium',
  clickable = true,
  className = ''
}) => {
  const navigate = useNavigate();

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24', 
    large: 'w-32 h-32'
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

  return (
    <div 
      className={`${sizeClasses[size]} ${positionClasses[position]} ${clickable ? 'logo-clickable' : ''} ${className}`}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
    >
      <LogoAnimation />
    </div>
  );
};

export default LogoHeader;