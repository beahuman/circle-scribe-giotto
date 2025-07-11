
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LineChart, Grid3X3, Settings } from 'lucide-react';
import LogoAnimation from './LogoAnimation';
import { useProgressNudge } from '@/hooks/useProgressNudge';
import ProgressNudgeBadge from './onboarding/ProgressNudgeBadge';

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
    <div className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 ${className}`}>
      <div className="grid grid-cols-5 h-16">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center text-xs min-h-[44px] min-w-[44px] touch-manipulation transition-smooth ${
            isActive('/') ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        {/* Draw */}
        <button
          onClick={handleDrawClick}
          className={`flex flex-col items-center justify-center text-xs min-h-[44px] min-w-[44px] touch-manipulation transition-smooth ${
            currentPath.includes('?mode=practice') ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div className="mb-1">
            <LogoAnimation size={20} />
          </div>
          <span>Draw</span>
        </button>
        
        {/* Progress */}
        <Link
          to="/progress"
          className={`flex flex-col items-center justify-center text-xs min-h-[44px] min-w-[44px] touch-manipulation transition-smooth ${
            isActive('/progress') ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
          onClick={() => {
            if (nudgeState.showNavBadge) {
              dismissNavBadge();
            }
          }}
        >
          <div className="relative mb-1">
            <LineChart className="h-5 w-5" />
            <ProgressNudgeBadge 
              show={nudgeState.showNavBadge && shouldShowProgressNudges()} 
            />
          </div>
          <span>Progress</span>
        </Link>
        
        {/* Modes */}
        <button
          onClick={handleModesClick}
          className={`flex flex-col items-center justify-center text-xs min-h-[44px] min-w-[44px] touch-manipulation transition-smooth ${
            currentPath.includes('?view=modes') ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Grid3X3 className="h-5 w-5 mb-1" />
          <span>Modes</span>
        </button>
        
        {/* Settings */}
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center text-xs min-h-[44px] min-w-[44px] touch-manipulation transition-smooth ${
            isActive('/settings') ? 'text-primary' : 'text-muted-foreground'
          }`}
          style={{ 
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <Settings className="h-5 w-5 mb-1" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
