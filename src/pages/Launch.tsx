
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

const Launch = () => {
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState(null);
  
  useEffect(() => {
    // Fetch the JSON file
    fetch('/GiottoAnimatedLogo.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation:', error));

    // Navigation timer
    const timer = setTimeout(() => {
      navigate('/auth');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {animationData && (
          <div className="w-[400px] mx-auto">
            <Lottie 
              animationData={animationData}
              loop={true}
              autoplay={true}
            />
          </div>
        )}
        
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
