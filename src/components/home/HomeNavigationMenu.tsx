
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Settings, Info, Store, History, UserCircle } from "lucide-react";

interface HomeNavigationMenuProps {
  isGuestMode?: boolean;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeNavigationMenu: React.FC<HomeNavigationMenuProps> = ({ isGuestMode }) => {
  return (
    <>
      {!isGuestMode && (
        <motion.div variants={fadeVariants}>
          <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
            <UserCircle className="mr-2 h-4 w-4" />
            Account
          </Button>
        </motion.div>
      )}

      <motion.div variants={fadeVariants}>
        <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
          <Store className="mr-2 h-4 w-4" />
          Store
        </Button>
      </motion.div>

      <motion.div variants={fadeVariants}>
        <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
          <Info className="mr-2 h-4 w-4" />
          About
        </Button>
      </motion.div>
    </>
  );
};

export default HomeNavigationMenu;
