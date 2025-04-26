import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import { preloadAnimation } from '@/utils/animationLoader';

const Launch = () => {
  const navigate = useNavigate();
  const [launchAnimationData, setLaunchAnimationData] = useState(null);
  const [isHomeAnimationLoaded, setIsHomeAnimationLoaded] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  
  useEffect(() => {
    // Start the animation sequence
    setTimeout(() => setShowTagline(true), 150);
    setTimeout(() => setShowLogo(true), 250);

    // Load both animations in parallel
    Promise.all([
      preloadAnimation('/GiottoAnimatedLogo.json'),
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className="w-full max-w-md">
        <div className="relative flex flex-col items-center">
          <div className={`transform transition-all duration-500 ease-out ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
            {launchAnimationData && (
              <div className="w-[400px]">
                <Lottie 
                  animationData={launchAnimationData}
                  loop={false}
                  autoplay={true}
                  onComplete={handleAnimationComplete}
                />
              </div>
            )}
          </div>
          
          <p className={`text-[#765ED8] text-xl font-bold text-center transform transition-all duration-500 ease-out mt-6 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
            Experience the art of drawing perfect circles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Launch;
