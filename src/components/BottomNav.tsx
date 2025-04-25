
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-muted/30 backdrop-blur-sm border-t border-muted fixed bottom-0 left-0 right-0 z-50">
      <Button 
        variant={isActive('/history') ? 'default' : 'ghost'}
        onClick={() => navigate('/history')}
        className="flex flex-col items-center py-2 h-auto text-xs"
      >
        <i className="ri-history-line text-2xl" />
        <span className="mt-1">History</span>
      </Button>
      
      <Button 
        variant={isActive('/about') ? 'default' : 'ghost'}
        onClick={() => navigate('/about')}
        className="flex flex-col items-center py-2 h-auto text-xs"
      >
        <i className="ri-information-line text-2xl" />
        <span className="mt-1">About</span>
      </Button>
      
      <Button 
        variant={isActive('/') ? 'default' : 'ghost'}
        onClick={() => navigate('/')}
        className="flex flex-col items-center py-2 h-auto text-xs"
      >
        <i className="ri-home-line text-2xl" />
        <span className="mt-1">Home</span>
      </Button>
      
      <Button 
        variant={isActive('/account') ? 'default' : 'ghost'}
        onClick={() => navigate('/account')}
        className="flex flex-col items-center py-2 h-auto text-xs"
      >
        <i className="ri-user-line text-2xl" />
        <span className="mt-1">Account</span>
      </Button>
      
      <Button 
        variant={isActive('/settings') ? 'default' : 'ghost'}
        onClick={() => navigate('/settings')}
        className="flex flex-col items-center py-2 h-auto text-xs"
      >
        <i className="ri-settings-line text-2xl" />
        <span className="mt-1">Settings</span>
      </Button>
    </div>
  );
};

export default BottomNav;

