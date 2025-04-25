import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="grid grid-cols-5 gap-2 p-2 bg-muted/30 backdrop-blur-sm border-t border-muted fixed bottom-0 left-0 right-0 z-50">
      <Button 
        variant="ghost"
        onClick={() => navigate('/history')}
        className="flex flex-col items-center py-1.5 h-auto text-xs text-primary group hover:bg-transparent"
      >
        <div className="relative mb-0.5">
          {isActive('/history') && (
            <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-purple-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <i className={cn(
            "ri-history-line text-xl relative z-10", 
            isActive('/history') ? "text-white" : "text-primary group-hover:text-primary"
          )} />
        </div>
        <span className="mt-0.5">History</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/about')}
        className="flex flex-col items-center py-1.5 h-auto text-xs text-primary group hover:bg-transparent"
      >
        <div className="relative mb-0.5">
          {isActive('/about') && (
            <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-purple-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <i className={cn(
            "ri-information-line text-xl relative z-10", 
            isActive('/about') ? "text-white" : "text-primary group-hover:text-primary"
          )} />
        </div>
        <span className="mt-0.5">About</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/')}
        className="flex flex-col items-center py-1.5 h-auto text-xs text-primary group hover:bg-transparent"
      >
        <div className="relative mb-0.5">
          {isActive('/') && (
            <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-purple-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <i className={cn(
            "ri-home-line text-xl relative z-10", 
            isActive('/') ? "text-white" : "text-primary group-hover:text-primary"
          )} />
        </div>
        <span className="mt-0.5">Home</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/account')}
        className="flex flex-col items-center py-1.5 h-auto text-xs text-primary group hover:bg-transparent"
      >
        <div className="relative mb-0.5">
          {isActive('/account') && (
            <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-purple-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <i className={cn(
            "ri-user-line text-xl relative z-10", 
            isActive('/account') ? "text-white" : "text-primary group-hover:text-primary"
          )} />
        </div>
        <span className="mt-0.5">Account</span>
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/settings')}
        className="flex flex-col items-center py-1.5 h-auto text-xs text-primary group hover:bg-transparent"
      >
        <div className="relative mb-0.5">
          {isActive('/settings') && (
            <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-primary rounded-full flex items-center justify-center" />
          )}
          <span className="absolute -top-[10px] -left-[14px] -right-[14px] -bottom-[10px] bg-purple-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
          <i className={cn(
            "ri-settings-line text-xl relative z-10", 
            isActive('/settings') ? "text-white" : "text-primary group-hover:text-primary"
          )} />
        </div>
        <span className="mt-0.5">Settings</span>
      </Button>
    </div>
  );
};

export default BottomNav;
