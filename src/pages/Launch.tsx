
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, UserPlus, Stars, Ghost } from "lucide-react";

const Launch = () => {
  const navigate = useNavigate();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showGuestAlert, setShowGuestAlert] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleGuestPlay = () => {
    setShowGuestAlert(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6">
      <div className={`transition-all duration-1000 ${animationComplete ? 'scale-75' : 'scale-100'}`}>
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-primary animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary">
              <Stars className="h-6 w-6 animate-pulse" />
              <span className="animate-float">Giotto</span>
              <Stars className="h-6 w-6 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      
      <div className={`space-y-4 w-full max-w-xs transition-all duration-500 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <Button 
          onClick={() => navigate('/signup')}
          className="w-full px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          size="lg"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Create Account
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate('/signin')}
          className="w-full px-8 py-6 text-lg rounded-full border-primary/30 hover:bg-primary/5"
          size="lg"
        >
          <LogIn className="mr-2 h-5 w-5" />
          Sign In
        </Button>

        <Button 
          variant="ghost"
          onClick={handleGuestPlay}
          className="w-full px-8 py-6 text-lg rounded-full hover:bg-primary/5"
          size="lg"
        >
          <Ghost className="mr-2 h-5 w-5" />
          Continue as Guest
        </Button>
        
        {showGuestAlert && (
          <Alert className="animate-in fade-in slide-in-from-bottom-4">
            <AlertDescription>
              Playing as a guest. Your scores won't be saved and you won't have access to Game Center features.
            </AlertDescription>
          </Alert>
        )}
        
        <p className="text-center text-sm text-muted-foreground pt-4">
          Experience the art of drawing perfect circles
        </p>
      </div>
    </div>
  );
};

export default Launch;
