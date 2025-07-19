import React from 'react';
import { motion } from 'framer-motion';

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const NeuroscienceFactsFooter: React.FC = () => {
  return (
    <motion.div 
      className="text-center pt-2"
      variants={fadeVariants}
      transition={{ delay: 0.6 }}
    >
      <p className="text-caption">
        Fact: Your cerebellum gets smarter with every circle
      </p>
    </motion.div>
  );
};

export default NeuroscienceFactsFooter;