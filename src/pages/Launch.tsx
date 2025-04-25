
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

const Launch = () => {
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    fetch('/GiottoAnimatedLogo.json')
      .then(response => response.json())
      .then(data => {
        setAnimationData(data);
      })
      .catch(error => console.error('Error loading animation:', error));
  }, []);

  const handleAnimationComplete = () => {
    navigate('/auth');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {animationData && (
          <div className="flex justify-center">
            <div className="w-[400px]">
              <Lottie 
                animationData={animationData}
                loop={false}
                autoplay={true}
                onComplete={handleAnimationComplete}
              />
            </div>
          </div>
        )}
        
        <p 
          className="text-[#765ED8] text-xl font-bold text-center"
        >
          Experience the art of drawing perfect circles
        </p>
      </div>
    </div>
  );
};

export default Launch;
