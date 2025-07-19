import React from 'react';
import { motion } from 'framer-motion';

interface NewUserGuidanceProps {
  isNewUser: boolean;
}

const NewUserGuidance: React.FC<NewUserGuidanceProps> = ({ isNewUser }) => {
  if (!isNewUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center"
    >
      <p className="text-sm text-primary font-medium">
        Start with Daily Calibration to begin your motor mastery journey.
      </p>
    </motion.div>
  );
};

export default NewUserGuidance;