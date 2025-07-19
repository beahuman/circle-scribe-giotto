
import React from 'react';
import { motion } from 'framer-motion';
import LogoAnimation from '../LogoAnimation';

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeHeader: React.FC = () => {
  return (
    <motion.div 
      className="space-y-2"
      variants={fadeVariants}
      transition={{ delay: 0.1 }}
    >
      <div className="w-full mx-auto">
        <LogoAnimation size={200} />
      </div>
      <p className="text-muted-foreground text-sm">The art of the perfect circle</p>
    </motion.div>
  );
};

export default HomeHeader;
