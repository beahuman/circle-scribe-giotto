
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { preloadAnimation } from '@/utils/animationLoader';
import logoAnimationData from '@/assets/logo-animation.json';

interface LogoAnimationProps {
  className?: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ className = '' }) => {
  const [animationData, setAnimationData] = useState<any>(logoAnimationData);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Try to load the main animation, fallback to local if it fails
    setIsLoading(true);
    preloadAnimation('/GiottoAnimatedLogo.json')
      .then(data => {
        setAnimationData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.warn('Using fallback animation:', error);
        setAnimationData(logoAnimationData);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={`w-[240px] ${className}`}>
      <Lottie 
        animationData={animationData}
        loop={true}
        autoplay={true}
        className="w-full h-auto"
      />
    </div>
  );
};

export default LogoAnimation;

