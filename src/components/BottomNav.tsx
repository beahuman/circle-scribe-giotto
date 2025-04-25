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
        className="flex flex-col items-center py-2 h-auto text-xs text-primary"
      >
        <div className="relative mb-1">
          {isActive('/history') && (
            <span className="absolute -top-[12px] -left-[16px] -right-[16px] -bottom-[12px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <i className={cn(
            "ri-history-line text-2xl relative z-10", 
            isActive('/history') ? "text-white" : "text-primary"
          )} />
        </div>
        <span className="mt-1">History</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/about')}
        className="flex flex-col items-center py-2 h-auto text-xs text-primary"
      >
        <div className="relative mb-1">
          {isActive('/about') && (
            <span className="absolute -top-[12px] -left-[16px] -right-[16px] -bottom-[12px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <i className={cn(
            "ri-information-line text-2xl relative z-10", 
            isActive('/about') ? "text-white" : "text-primary"
          )} />
        </div>
        <span className="mt-1">About</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/')}
        className="flex flex-col items-center py-2 h-auto text-xs text-primary"
      >
        <div className="relative mb-1">
          {isActive('/') && (
            <span className="absolute -top-[12px] -left-[16px] -right-[16px] -bottom-[12px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <i className={cn(
            "ri-home-line text-2xl relative z-10", 
            isActive('/') ? "text-white" : "text-primary"
          )} />
        </div>
        <span className="mt-1">Home</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/account')}
        className="flex flex-col items-center py-2 h-auto text-xs text-primary"
      >
        <div className="relative mb-1">
          {isActive('/account') && (
            <span className="absolute -top-[12px] -left-[16px] -right-[16px] -bottom-[12px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <i className={cn(
            "ri-user-line text-2xl relative z-10", 
            isActive('/account') ? "text-white" : "text-primary"
          )} />
        </div>
        <span className="mt-1">Account</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/settings')}
        className="flex flex-col items-center py-2 h-auto text-xs text-primary"
      >
        <div className="relative mb-1">
          {isActive('/settings') && (
            <span className="absolute -top-[12px] -left-[16px] -right-[16px] -bottom-[12px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <i className={cn(
            "ri-settings-line text-2xl relative z-10", 
            isActive('/settings') ? "text-white" : "text-primary"
          )} />
        </div>
        <span className="mt-1">Settings</span>
      </Button>
    </div>
  );
};

export default BottomNav;
