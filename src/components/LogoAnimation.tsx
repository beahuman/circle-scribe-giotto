
import React from 'react';
import Lottie from 'lottie-react';
// Import the animation data properly - assuming the file is in the public folder
import logoAnimationData from '../assets/logo-animation.json';

interface LogoAnimationProps {
  className?: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ className }) => {
  return (
    <div className={className}>
      <Lottie 
        animationData={logoAnimationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default LogoAnimation;
