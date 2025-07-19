
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
      navigate('/');
    }
  };
  
  if (!launchAnimationData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80">
        <div className="w-32 h-32 border-4 border-primary rounded-full animate-spin border-t-transparent" />
        <p className="text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 px-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <div className="w-full max-w-[320px] aspect-square">
          <Lottie 
            animationData={launchAnimationData}
            loop={false}
            autoplay={true}
            onComplete={handleAnimationComplete}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Launch;
