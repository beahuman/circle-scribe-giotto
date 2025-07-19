
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Shuffle, Infinity, Zap } from 'lucide-react';
import UnifiedCard from './UnifiedCard';

interface PracticeModesMenuProps {
  onStartNormal: () => void;
  onStartBlindDraw: () => void;
  onStartOffset: () => void;
  onStartGauntlet: () => void;
  onStartInfinitePractice: () => void;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const PracticeModesMenu: React.FC<PracticeModesMenuProps> = ({
  onStartNormal,
  onStartBlindDraw,
  onStartOffset,
  onStartGauntlet,
  onStartInfinitePractice
}) => {
  const practiceMode = [
    {
      name: "Normal Practice",
      description: "Classic circle drawing",
      icon: Target,
      action: onStartNormal,
      color: "text-blue-600"
    },
    {
      name: "Blind Draw",
      description: "Draw without seeing your line",
      icon: Eye,
      action: onStartBlindDraw,
      color: "text-purple-600"
    },
    {
      name: "Offset Mode",
      description: "Cursor displaced from drawing",
      icon: Shuffle,
      action: onStartOffset,
      color: "text-green-600"
    },
    {
      name: "Perception Gauntlet",
      description: "Advanced challenge mode",
      icon: Zap,
      action: onStartGauntlet,
      color: "text-orange-600"
    },
    {
      name: "Infinite Practice",
      description: "Continuous drawing session",
      icon: Infinity,
      action: onStartInfinitePractice,
      color: "text-pink-600"
    }
  ];

  return (
    <motion.div 
      className="space-y-3"
      variants={fadeVariants}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-1">Practice Modes</h3>
        <p className="text-sm text-muted-foreground">Choose your training focus</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {practiceMode.map((mode, index) => (
          <motion.div
            key={mode.name}
            variants={fadeVariants}
            transition={{ delay: index * 0.05 }}
          >
            <UnifiedCard
              variant="default"
              size="sm"
              interactive
              onClick={mode.action}
              className="hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <mode.icon className={`h-5 w-5 ${mode.color}`} strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm text-foreground truncate">{mode.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{mode.description}</p>
                </div>
              </div>
            </UnifiedCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PracticeModesMenu;
