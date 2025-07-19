
import React from 'react';
import { motion } from 'framer-motion';
import LogoHeader from '../common/LogoHeader';

const fadeVariants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeHeaderSection: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center justify-between w-full mb-6"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1">
        <LogoHeader />
      </div>
    </motion.div>
  );
};

export default HomeHeaderSection;
