
import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';

interface LogoAnimationProps {
  className?: string;
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({ className }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  
  useEffect(() => {
    // Fetch the JSON file from the public directory
    fetch('/GiottoAnimatedLogo.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  if (!animationData) {
    // Show a simple loading state while the animation loads
    return <div className={className}>Loading...</div>;
  }

  return (
    <div className={className}>
      <Lottie 
        animationData={animationData}
        loop={true}
        autoplay={true}
      />
    </div>
  );
};

export default LogoAnimation;
