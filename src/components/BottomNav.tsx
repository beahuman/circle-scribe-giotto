import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, Settings, User, Palette } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="grid grid-cols-5 h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link
          to="/store"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/store') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Palette className="h-5 w-5 mb-1" />
          <span>Store</span>
        </Link>
        
        <Link
          to="/history"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/history') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <LineChart className="h-5 w-5 mb-1" />
          <span>History</span>
        </Link>
        
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span>Settings</span>
        </Link>
        
        <Link
          to="/account"
          className={`flex flex-col items-center justify-center text-xs ${
            isActive('/account') ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <User className="h-5 w-5 mb-1" />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
