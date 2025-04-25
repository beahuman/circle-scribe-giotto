
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import animationData from '/GiottoAnimatedLogo.json';

const Launch = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="w-[400px] mx-auto">
          <Lottie 
            animationData={animationData}
            loop={true}
            autoplay={true}
          />
        </div>
        
        <p 
          className="text-[#765ED8] text-xl font-bold animate-in fade-in slide-in-from-bottom duration-1000 delay-300"
        >
          Experience the art of drawing perfect circles
        </p>
      </div>
    </div>
  );
};

export default Launch;
