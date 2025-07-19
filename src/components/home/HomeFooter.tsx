
import React from 'react';
import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeFooter: React.FC = () => {
  return (
    <motion.p 
      className="text-xs text-muted-foreground"
      variants={fadeVariants}
      transition={{ delay: 0.3 }}
    >
      Crafted with passion by <a href="https://twitter.com/Nutlope" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">@Nutlope</a>
    </motion.p>
  );
};

export default HomeFooter;
