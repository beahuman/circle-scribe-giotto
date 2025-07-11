import React from 'react';
import { motion } from 'framer-motion';
import HomeHeader from './HomeHeader';
import { useToneSystem } from '@/hooks/useToneSystem';

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeHeaderSection: React.FC = () => {
  const { getMotivationalPhraseForTone, getActiveThemeStyles } = useToneSystem();
  const themeStyles = getActiveThemeStyles();

  return (
    <motion.div 
      className="text-center space-y-4"
      variants={fadeVariants}
      transition={{ delay: 0.1 }}
    >
      <div className="w-[200px] mx-auto">
        <HomeHeader />
      </div>
      <motion.p 
        className={`text-body-lg leading-relaxed ${themeStyles.accent}`}
        key={getMotivationalPhraseForTone()} // Re-animate when phrase changes
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {getMotivationalPhraseForTone()}
      </motion.p>
    </motion.div>
  );
};

export default HomeHeaderSection;