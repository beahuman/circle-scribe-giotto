import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ProgressNudgeBadgeProps {
  show: boolean;
  className?: string;
}

const ProgressNudgeBadge: React.FC<ProgressNudgeBadgeProps> = ({ 
  show, 
  className = "" 
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className={`relative ${className}`}
    >
      {/* Pulsing dot indicator */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
      />
      
      {/* Glow effect */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.1
        }}
        className="absolute -top-2 -right-2 w-5 h-5 bg-purple-400 rounded-full blur-sm opacity-40"
      />
      
      {/* Optional sparkle effect */}
      <motion.div
        animate={{
          rotate: [0, 180, 360],
          scale: [0.8, 1.1, 0.8]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-0.5 -right-0.5 opacity-80"
      >
        <Sparkles className="w-2 h-2 text-yellow-400" />
      </motion.div>
    </motion.div>
  );
};

export default ProgressNudgeBadge;