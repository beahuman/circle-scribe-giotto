
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, Grid3X3, Settings, Pen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgressNudge } from '@/hooks/useProgressNudge';
import ProgressNudgeBadge from './onboarding/ProgressNudgeBadge';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
  hideOnPaths?: string[];
  className?: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  hideOnPaths = [],
  className = ''
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { nudgeState, shouldShowProgressNudges, dismissNavBadge } = useProgressNudge();
  const { user } = useAuth();
  
  // Style utilities for nav items
  const navItemBase = "flex flex-col items-center justify-center gap-1.5 w-full py-2 relative transition-colors focus-visible:outline-none focus-visible:bg-accent/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
  const navItemActive = "text-primary after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-0.5 after:bg-primary after:rounded-full after:shadow-glow";
  
  // Hide nav on specific paths (like active drawing)
  if (hideOnPaths.includes(currentPath)) {
    return null;
  }
  
  const isActive = (path: string) => {
    return currentPath === path;
  };

  const handleDrawClick = () => {
    // Navigate to home with practice mode query parameter
    navigate('/?mode=practice');
  };

  const handleModesClick = () => {
    // Navigate to home with modes view
    navigate('/?view=modes');
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-elegant z-40 ${className}`}>
      <nav className="grid grid-cols-5 h-16 max-w-screen-lg mx-auto px-safe">
        {/* Home */}
        <Link
          to="/"
          className={`${navItemBase} ${isActive('/') ? navItemActive : 'text-muted-foreground hover:text-foreground'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <Home className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-caption">Home</span>
        </Link>
        
        {/* Draw */}
        <button
          onClick={handleDrawClick}
          className={`${navItemBase} ${currentPath.includes('?mode=practice') ? navItemActive : 'text-muted-foreground hover:text-foreground'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <Pen className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-caption">Draw</span>
        </button>
        
        {/* Progress */}
        <Link
          to="/progress"
          className={`${navItemBase} ${isActive('/progress') ? navItemActive : 'text-muted-foreground hover:text-foreground'}`}
          style={{ touchAction: 'manipulation' }}
          onClick={() => {
            if (nudgeState.showNavBadge) {
              dismissNavBadge();
            }
          }}
        >
          <div className="relative">
            <LineChart className="h-6 w-6" strokeWidth={1.5} />
            <ProgressNudgeBadge 
              show={nudgeState.showNavBadge && shouldShowProgressNudges()} 
            />
          </div>
          <span className="text-caption">Progress</span>
        </Link>
        
        {/* Modes */}
        <button
          onClick={handleModesClick}
          className={`${navItemBase} ${currentPath.includes('?view=modes') ? navItemActive : 'text-muted-foreground hover:text-foreground'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <Grid3X3 className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-caption">Modes</span>
        </button>
        
        {/* Account */}
        <Link
          to="/account"
          className={`${navItemBase} ${isActive('/account') ? navItemActive : 'text-muted-foreground hover:text-foreground'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <User className="h-6 w-6" strokeWidth={1.5} />
          <span className="text-caption">Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default BottomNav;
