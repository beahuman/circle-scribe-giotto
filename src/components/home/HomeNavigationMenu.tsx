
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Settings, Info, BarChart3, HelpCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import WhyCirclesModal from '../WhyCirclesModal';

interface HomeNavigationMenuProps {
  isGuestMode?: boolean;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeNavigationMenu: React.FC<HomeNavigationMenuProps> = ({ isGuestMode }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="flex items-center justify-center gap-4"
      variants={fadeVariants}
    >
      {/* Progress */}
      <Button 
        variant="ghost" 
        size="sm"
        className="flex flex-col items-center gap-1 p-2 h-auto text-xs text-slate-600 hover:text-slate-800"
        onClick={() => navigate('/progress')}
      >
        <BarChart3 className="h-4 w-4" />
        Progress
      </Button>

      {/* Why Circles? */}
      <WhyCirclesModal>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex flex-col items-center gap-1 p-2 h-auto text-xs text-slate-600 hover:text-slate-800"
        >
          <HelpCircle className="h-4 w-4" />
          Why Circles?
        </Button>
      </WhyCirclesModal>

      {/* Settings */}
      <Button 
        variant="ghost" 
        size="sm"
        className="flex flex-col items-center gap-1 p-2 h-auto text-xs text-slate-600 hover:text-slate-800"
        onClick={() => navigate('/settings')}
      >
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </motion.div>
  );
};

export default HomeNavigationMenu;
