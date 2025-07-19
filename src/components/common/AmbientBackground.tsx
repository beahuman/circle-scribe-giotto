
import React from 'react';
import { motion } from 'framer-motion';

interface AmbientBackgroundProps {
  variant?: 'home' | 'draw' | 'subtle';
  className?: string;
}

const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ 
  variant = 'subtle',
  className = ''
}) => {
  const getAnimationConfig = () => {
    switch (variant) {
      case 'home':
        return {
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse" as const
        };
      case 'draw':
        return {
          duration: 12,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse" as const
        };
      default:
        return {
          duration: 6,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse" as const
        };
    }
  };

  const config = getAnimationConfig();

  if (variant === 'home') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={config}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.1, 0.9, 1.1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -15, 0],
            y: [0, 15, 0]
          }}
          transition={{ ...config, delay: 2 }}
        />
      </div>
    );
  }

  if (variant === 'draw') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <motion.div
          className="absolute top-1/2 left-1/2 w-32 h-32 border border-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={config}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-24 border border-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.05, 0.2, 0.05],
            rotate: [360, 180, 0]
          }}
          transition={{ ...config, delay: 1 }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-primary/3 rounded-full blur-2xl"
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={config}
      />
    </div>
  );
};

export default AmbientBackground;
