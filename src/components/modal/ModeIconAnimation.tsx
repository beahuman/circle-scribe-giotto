import React from 'react';
import { motion } from 'framer-motion';

interface ModeIconAnimationProps {
  modeId: string;
  isVisible: boolean;
}

const ModeIconAnimation: React.FC<ModeIconAnimationProps> = ({ modeId, isVisible }) => {
  const getAnimationForMode = () => {
    switch (modeId) {
      case 'blind-draw':
        return <BlindDrawAnimation isVisible={isVisible} />;
      case 'spiral-mode':
        return <SpiralModeAnimation isVisible={isVisible} />;
      case 'offset-mode':
        return <OffsetModeAnimation isVisible={isVisible} />;
      case 'perception-gauntlet':
        return <PerceptionGauntletAnimation isVisible={isVisible} />;
      default:
        return <DefaultAnimation isVisible={isVisible} />;
    }
  };

  return (
    <div className="relative w-24 h-24 mx-auto">
      {getAnimationForMode()}
    </div>
  );
};

// Blind Mode: Screen fades to black → circle forms from memory → gentle reveal
const BlindDrawAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    className="absolute inset-0"
  >
    {/* Background fade to black */}
    <motion.rect
      width="96"
      height="96"
      fill="hsl(var(--background))"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: [0, 0.8, 0.2] } : { opacity: 0 }}
      transition={{ duration: 2, times: [0, 0.4, 1] }}
    />
    
    {/* Memory circle formation */}
    <motion.circle
      cx="48"
      cy="48"
      r="30"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="3"
      strokeDasharray="188.4"
      strokeDashoffset="188.4"
      strokeLinecap="round"
      initial={{ strokeDashoffset: 188.4, opacity: 0 }}
      animate={isVisible ? { 
        strokeDashoffset: 0, 
        opacity: [0, 0, 1],
        scale: [0.8, 1.1, 1]
      } : { strokeDashoffset: 188.4, opacity: 0 }}
      transition={{ 
        duration: 1.5, 
        delay: 0.5,
        times: [0, 0.3, 1],
        ease: "easeInOut"
      }}
    />
    
    {/* Gentle glow reveal */}
    <motion.circle
      cx="48"
      cy="48"
      r="30"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="1"
      opacity="0.3"
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { 
        scale: [0, 1.5, 1],
        opacity: [0, 0.6, 0.3]
      } : { scale: 0, opacity: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
    />
  </motion.svg>
);

// Spiral Mode: Spiral brushstroke draws inward with light pulse
const SpiralModeAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    className="absolute inset-0"
  >
    {/* Spiral path */}
    <motion.path
      d="M48 16 C66 16, 80 30, 80 48 C80 66, 66 80, 48 80 C30 80, 16 66, 16 48 C16 36, 24 28, 32 28 C40 28, 44 32, 44 40 C44 44, 42 46, 40 46"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="280"
      strokeDashoffset="280"
      initial={{ strokeDashoffset: 280 }}
      animate={isVisible ? { strokeDashoffset: 0 } : { strokeDashoffset: 280 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    
    {/* Pulsing center point */}
    <motion.circle
      cx="40"
      cy="46"
      r="3"
      fill="hsl(var(--primary))"
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { 
        scale: [0, 1.5, 1],
        opacity: [0, 1, 0.8]
      } : { scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, delay: 1.8 }}
    />
    
    {/* Light pulse effect */}
    <motion.circle
      cx="48"
      cy="48"
      r="35"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="1"
      opacity="0.2"
      initial={{ scale: 0 }}
      animate={isVisible ? { 
        scale: [0, 1.2, 1],
        opacity: [0, 0.4, 0.1]
      } : { scale: 0 }}
      transition={{ duration: 1.5, delay: 1.5 }}
    />
  </motion.svg>
);

// Offset Mode: Two circles draw offset, then converge momentarily
const OffsetModeAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    className="absolute inset-0"
  >
    {/* Reference circle (offset) */}
    <motion.circle
      cx="35"
      cy="35"
      r="20"
      fill="none"
      stroke="hsl(var(--muted-foreground))"
      strokeWidth="2"
      strokeDasharray="125.6"
      strokeDashoffset="125.6"
      strokeOpacity="0.5"
      initial={{ strokeDashoffset: 125.6 }}
      animate={isVisible ? { strokeDashoffset: 0 } : { strokeDashoffset: 125.6 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    />
    
    {/* User's circle */}
    <motion.circle
      cx="61"
      cy="61"
      r="20"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="3"
      strokeDasharray="125.6"
      strokeDashoffset="125.6"
      strokeLinecap="round"
      initial={{ strokeDashoffset: 125.6 }}
      animate={isVisible ? { strokeDashoffset: 0 } : { strokeDashoffset: 125.6 }}
      transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
    />
    
    {/* Convergence effect */}
    <motion.line
      x1="35"
      y1="35"
      x2="61"
      y2="61"
      stroke="hsl(var(--primary))"
      strokeWidth="1"
      strokeDasharray="4 4"
      strokeOpacity="0.4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={isVisible ? { 
        pathLength: [0, 1, 0],
        opacity: [0, 0.6, 0]
      } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 1, delay: 1.5 }}
    />
  </motion.svg>
);

// Perception Gauntlet: Flashing sequences morph into final glyph
const PerceptionGauntletAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    className="absolute inset-0"
  >
    {/* Rapid mode sequence flashes */}
    <motion.g
      initial={{ opacity: 0 }}
      animate={isVisible ? { 
        opacity: [0, 1, 0, 1, 0, 1, 0]
      } : { opacity: 0 }}
      transition={{ duration: 1.5, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6] }}
    >
      {/* Blind mode flash */}
      <rect width="96" height="96" fill="hsl(var(--background))" opacity="0.8" />
      
      {/* Spiral mode flash */}
      <path
        d="M48 25 C60 25, 70 35, 70 48 C70 60, 60 70, 48 70 C35 70, 25 60, 25 48"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.6"
      />
      
      {/* Offset circles flash */}
      <circle cx="40" cy="40" r="15" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="2" opacity="0.4" />
      <circle cx="56" cy="56" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
    </motion.g>
    
    {/* Final gauntlet glyph */}
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={isVisible ? { 
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0.9]
      } : { scale: 0, opacity: 0 }}
      transition={{ duration: 1, delay: 1.5, ease: "backOut" }}
    >
      {/* Central diamond */}
      <polygon
        points="48,30 62,48 48,66 34,48"
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      
      {/* Corner accents */}
      <circle cx="48" cy="30" r="2" fill="hsl(var(--primary))" />
      <circle cx="62" cy="48" r="2" fill="hsl(var(--primary))" />
      <circle cx="48" cy="66" r="2" fill="hsl(var(--primary))" />
      <circle cx="34" cy="48" r="2" fill="hsl(var(--primary))" />
    </motion.g>
    
    {/* Power glow */}
    <motion.circle
      cx="48"
      cy="48"
      r="35"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="1"
      opacity="0.2"
      initial={{ scale: 0 }}
      animate={isVisible ? { 
        scale: [0, 1.5, 1],
        opacity: [0, 0.4, 0.1]
      } : { scale: 0 }}
      transition={{ duration: 1.5, delay: 2 }}
    />
  </motion.svg>
);

// Default animation for other modes
const DefaultAnimation: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.svg
    width="96"
    height="96"
    viewBox="0 0 96 96"
    className="absolute inset-0"
  >
    <motion.circle
      cx="48"
      cy="48"
      r="25"
      fill="none"
      stroke="hsl(var(--primary))"
      strokeWidth="3"
      strokeDasharray="157"
      strokeDashoffset="157"
      strokeLinecap="round"
      initial={{ strokeDashoffset: 157, scale: 0.8 }}
      animate={isVisible ? { 
        strokeDashoffset: 0,
        scale: [0.8, 1.1, 1]
      } : { strokeDashoffset: 157, scale: 0.8 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    />
  </motion.svg>
);

export default ModeIconAnimation;