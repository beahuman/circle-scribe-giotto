
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { preloadAnimation } from '@/utils/animationLoader';

const Launch = () => {
  const navigate = useNavigate();
  const [launchAnimationData, setLaunchAnimationData] = useState(null);
  const [isHomeAnimationLoaded, setIsHomeAnimationLoaded] = useState(false);
  
  useEffect(() => {
    // Load both animations in parallel
    Promise.all([
      preloadAnimation('/GiottoAnimatedLogo.json'),
      // Load the home animation first to ensure it's ready
      preloadAnimation('/GiottoAnimatedLogo.json')
    ]).then(([launchAnim, _]) => {
      setLaunchAnimationData(launchAnim);
      setIsHomeAnimationLoaded(true);
    }).catch(error => console.error('Error loading animations:', error));
  }, []);

  const handleAnimationComplete = () => {
    // Only redirect if the home animation is loaded
    if (isHomeAnimationLoaded) {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {launchAnimationData && (
          <div className="flex justify-center">
            <div className="w-[400px]">
              <Lottie 
                animationData={launchAnimationData}
                loop={false}
                autoplay={true}
                onComplete={handleAnimationComplete}
              />
            </div>
          </div>
        )}
        
        <p className="text-[#765ED8] text-xl font-bold text-center">
          Experience the art of drawing perfect circles
        </p>
      </div>
    </div>
  );
};

export default Launch;
