import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy } from 'lucide-react';

interface MedalDisplayProps {
  medal: 'none' | 'bronze' | 'silver' | 'gold';
  score: number;
}

const MedalDisplay: React.FC<MedalDisplayProps> = ({ medal, score }) => {
  const [showMedal, setShowMedal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMedal(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (medal === 'none') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-4"
      >
        <div className="text-4xl mb-2">🎯</div>
        <p className="text-sm text-muted-foreground">
          Keep practicing! You're {(60 - score).toFixed(1)}% away from Bronze
        </p>
      </motion.div>
    );
  }

  const medalConfig = {
    bronze: {
      icon: Award,
      color: 'from-amber-600 to-amber-800',
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-300',
      glow: 'shadow-amber-500/20',
      message: 'Bronze Medal!',
      description: 'Good foundation - keep building on it!',
      emoji: '🥉'
    },
    silver: {
      icon: Star,
      color: 'from-slate-400 to-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-300',
      glow: 'shadow-slate-500/20',
      message: 'Silver Medal!',
      description: 'Excellent precision - you\'re almost there!',
      emoji: '🥈'
    },
    gold: {
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      glow: 'shadow-yellow-500/30',
      message: 'Gold Medal!',
      description: 'Outstanding! Giotto himself would be proud!',
      emoji: '🥇'
    }
  };

  const config = medalConfig[medal];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
      animate={{ 
        opacity: showMedal ? 1 : 0, 
        scale: showMedal ? 1 : 0.5,
        rotateY: showMedal ? 0 : -180
      }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.2
      }}
      className="text-center"
    >
      {/* Medal Animation Container */}
      <motion.div
        animate={showMedal ? { 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        className="relative inline-block mb-4"
      >
        {/* Glow Effect */}
        <motion.div
          animate={showMedal ? {
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.color} opacity-30 blur-lg`}
        />
        
        {/* Medal Circle */}
        <div className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${config.color} shadow-lg ${config.glow} flex items-center justify-center border-4 ${config.borderColor}`}>
          <IconComponent className="h-10 w-10 text-white" />
        </div>

        {/* Sparkle Effects for Gold */}
        {medal === 'gold' && showMedal && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 40]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut"
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
              />
            ))}
          </>
        )}
      </motion.div>

      {/* Medal Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{config.emoji}</span>
          <h3 className={`text-xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
            {config.message}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          {config.description}
        </p>
      </motion.div>

      {/* Score Range Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-3 text-xs text-muted-foreground"
      >
        {medal === 'bronze' && 'Scored 60-74%'}
        {medal === 'silver' && 'Scored 75-89%'}
        {medal === 'gold' && 'Scored 90%+'}
      </motion.div>
    </motion.div>
  );
};

export default MedalDisplay;