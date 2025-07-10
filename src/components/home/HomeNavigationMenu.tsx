
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Settings, Info, Store, History, UserCircle, Trophy } from "lucide-react";
import { useNavigate } from 'react-router-dom';

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
    <>
      {!isGuestMode && (
        <motion.div variants={fadeVariants}>
          <Button 
            variant="ghost" 
            className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
            onClick={() => navigate('/account')}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Account
          </Button>
        </motion.div>
      )}

      <motion.div variants={fadeVariants}>
        <Button 
          variant="ghost" 
          className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
          onClick={() => navigate('/achievements')}
        >
          <Trophy className="mr-2 h-4 w-4" />
          Achievements
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button 
          variant="ghost" 
          className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button 
          variant="ghost" 
          className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
          onClick={() => navigate('/history')}
        >
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button 
          variant="ghost" 
          className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
          onClick={() => navigate('/store')}
        >
          <Store className="mr-2 h-4 w-4" />
          Store
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button 
          variant="ghost" 
          className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
          onClick={() => navigate('/about')}
        >
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>
      </motion.div>
    </>
  );
};

export default HomeNavigationMenu;
