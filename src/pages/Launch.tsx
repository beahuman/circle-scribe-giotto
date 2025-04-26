
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { preloadAnimation } from '@/utils/animationLoader';
import BottomNav from '@/components/BottomNav';

const Launch = () => {
  const navigate = useNavigate();
  const [launchAnimationData, setLaunchAnimationData] = useState(null);
  const [isHomeAnimationLoaded, setIsHomeAnimationLoaded] = useState(false);
  
  useEffect(() => {
    // Load both animations in parallel
    Promise.all([
      preloadAnimation('/GiottoAnimatedLogoLaunchScreen.json'),
      preloadAnimation('/GiottoAnimatedLogo.json')
    ]).then(([launchAnim, _]) => {
      setLaunchAnimationData(launchAnim);
      setIsHomeAnimationLoaded(true);
    }).catch(error => console.error('Error loading animations:', error));
  }, []);

  const handleAnimationComplete = () => {
    if (isHomeAnimationLoaded) {
      navigate('/auth');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 pb-16">
      <div className="w-full max-w-md flex flex-col items-center">
        {launchAnimationData && (
          <div className="w-[345px]">
            <Lottie 
              animationData={launchAnimationData}
              loop={false}
              autoplay={true}
              onComplete={handleAnimationComplete}
            />
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Launch;
