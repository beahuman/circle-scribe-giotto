
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-muted/30 backdrop-blur-sm border-t border-muted fixed bottom-0 left-0 right-0 z-50">
      <Button 
        variant="ghost"
        onClick={() => navigate('/history')}
        className={cn(
          "flex flex-col items-center py-2 h-auto text-xs text-primary",
          isActive('/history') && "relative"
        )}
      >
        {isActive('/history') && (
          <span className="absolute inset-0 bg-primary/10 rounded-full" />
        )}
        <i className="ri-history-line text-2xl" />
        <span className="mt-1">History</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/about')}
        className={cn(
          "flex flex-col items-center py-2 h-auto text-xs text-primary",
          isActive('/about') && "relative"
        )}
      >
        {isActive('/about') && (
          <span className="absolute inset-0 bg-primary/10 rounded-full" />
        )}
        <i className="ri-information-line text-2xl" />
        <span className="mt-1">About</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/')}
        className={cn(
          "flex flex-col items-center py-2 h-auto text-xs text-primary",
          isActive('/') && "relative"
        )}
      >
        {isActive('/') && (
          <span className="absolute inset-0 bg-primary/10 rounded-full" />
        )}
        <i className="ri-home-line text-2xl" />
        <span className="mt-1">Home</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/account')}
        className={cn(
          "flex flex-col items-center py-2 h-auto text-xs text-primary",
          isActive('/account') && "relative"
        )}
      >
        {isActive('/account') && (
          <span className="absolute inset-0 bg-primary/10 rounded-full" />
        )}
        <i className="ri-user-line text-2xl" />
        <span className="mt-1">Account</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/settings')}
        className={cn(
          "flex flex-col items-center py-2 h-auto text-xs text-primary",
          isActive('/settings') && "relative"
        )}
      >
        {isActive('/settings') && (
          <span className="absolute inset-0 bg-primary/10 rounded-full" />
        )}
        <i className="ri-settings-line text-2xl" />
        <span className="mt-1">Settings</span>
      </Button>
    </div>
  );
};

export default BottomNav;
