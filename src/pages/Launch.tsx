
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
    // Simple sequential animation timing
    setShowLogo(true);
    setTimeout(() => setShowTagline(true), 150);

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
          <div className={`transform transition-opacity duration-250 ${showLogo ? 'opacity-100' : 'opacity-0'}`}>
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
          
          <p className={`text-[#765ED8] text-xl font-bold text-center transform transition-opacity duration-100 mt-8 ${showTagline ? 'opacity-100' : 'opacity-0'}`}>
            Experience the art of drawing perfect circles
          </p>
        </div>
      </div>
    </div>
  );
};

export default Launch;
