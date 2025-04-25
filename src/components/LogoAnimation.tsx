
import React from 'react';
import Lottie from 'lottie-react';

interface LogoAnimationProps {
  className?: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ className }) => {
  return (
    <div className={className}>
      <Lottie 
        animationData={require('/public/logo-animation.json')} 
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default LogoAnimation;
